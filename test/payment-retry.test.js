import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { openTestProcessor } from '../examples/payment-retry.mjs';

test('a lost payment response can be retried on another connection without a second charge', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'seniormode-payment-'));
  const path = join(directory, 'processor.sqlite');
  const first = new DatabaseSync(path);
  const retry = new DatabaseSync(path);
  t.after(async () => {
    first.close();
    retry.close();
    await rm(directory, { recursive: true });
  });
  const charge = { account: 'buyer', intent: 'purchase-42', cents: 1250 };
  assert.throws(() => openTestProcessor(first)(charge, { loseResponse: true }), /Response lost/);
  const request = openTestProcessor(retry);
  assert.deepEqual(request(charge), { status: 200, intent: 'purchase-42', cents: 1250 });
  assert.deepEqual(request({ ...charge, cents: 1300 }), { status: 409 });
  assert.equal(retry.prepare('SELECT count(*) AS total FROM charges').get().total, 1);
});
