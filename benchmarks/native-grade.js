import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';
import { nativeCases } from './native-cases.js';

const statuses = results => results.map(result => result.status).sort();
const ids = tracks => tracks.map(track => track.id);
const repeated = tracks => tracks.slice(1).filter((track, index) => track.artist === tracks[index].artist).length;
const tracksFor = artists => artists.map((artist, id) => ({ artist, id }));
const rows = [
  { timestamp: 8, id: 99 }, { timestamp: 9, id: 6 },
  { timestamp: 10, id: 1 }, { timestamp: 9, id: 8 },
];
const inserted = [{ timestamp: 12, id: 12 }, ...rows];
const booking = { room: 'last-room', night: '2030-06-14', guest: 'A' };

async function withDatabase(run) {
  const root = await mkdtemp(join(tmpdir(), 'seniormode-grade-'));
  try {
    return await run(join(root, 'bookings.sqlite'));
  } finally {
    await rm(root, { recursive: true });
  }
}

async function competingWriters(moduleUrl, databasePath) {
  const gate = new Int32Array(new SharedArrayBuffer(4));
  const workers = ['A', 'B'].map(guest => new Worker(
    "const { parentPort, workerData } = require('node:worker_threads');"
    + '(async () => {'
    + 'const { reserve } = await import(workerData.moduleUrl);'
    + 'parentPort.postMessage("ready");'
    + 'Atomics.wait(workerData.gate, 0, 0, 5000);'
    + 'parentPort.postMessage(await reserve(workerData.request));'
    + '})().catch(error => { throw error; });',
    { eval: true, workerData: { moduleUrl, gate, request: { ...booking, databasePath, guest } } },
  ));
  try {
    assert.deepEqual(await Promise.all(workers.map(worker => once(worker, 'message'))), [['ready'], ['ready']]);
    const results = Promise.all(workers.map(worker => once(worker, 'message')));
    Atomics.store(gate, 0, 1);
    Atomics.notify(gate, 0);
    return (await results).map(([result]) => result);
  } finally {
    await Promise.all(workers.map(worker => worker.terminate()));
  }
}

function simulatedGateway({ loseReply = false } = {}) {
  const charges = new Map();
  return {
    charges,
    async charge({ key, cents }) {
      assert.equal(typeof key, 'string');
      assert(key.length > 0);
      const existing = charges.get(key);
      if (existing) return existing.cents === cents ? existing : { status: 409 };
      const receipt = { status: 200, cents, receiptId: charges.size + 1 };
      charges.set(key, receipt);
      if (loseReply) {
        loseReply = false;
        throw new Error('Response lost after processing');
      }
      return receipt;
    },
  };
}

function buildChecks(context) {
  const { root, metadata } = context;
  const uri = path => pathToFileURL(join(root, path)).href;
  const load = path => import(uri(path));
  const checkCents = async (cents, expected) => {
    const { checkoutLabel } = await load('src/checkout.mjs');
    const { invoiceLabel } = await load('src/invoice.mjs');
    for (const label of [checkoutLabel, invoiceLabel]) {
      if (typeof expected === 'function') assert.throws(() => label(cents), expected);
      else assert.equal(label(cents), expected);
    }
  };
  return {
    'greenfield-booking': {
      functional: [
        () => withDatabase(async databasePath => {
          const { reserve } = await load('src/bookings.mjs');
          const first = await reserve({ ...booking, databasePath });
          const second = await reserve({ ...booking, databasePath, guest: 'B' });
          assert.deepEqual([first.status, second.status], [201, 409]);
        }),
        () => withDatabase(async databasePath => {
          const { reserve } = await load('src/bookings.mjs');
          for (const change of [{}, { room: 'other-room' }, { night: '2030-06-15' }]) {
            assert.equal((await reserve({ ...booking, databasePath, ...change })).status, 201);
          }
        }),
      ],
      edge: [() => withDatabase(async databasePath => {
        const { reserve } = await load('src/bookings.mjs');
        const answers = await competingWriters(uri('src/bookings.mjs'), databasePath);
        assert.deepEqual(statuses(answers), [201, 409]);
        assert.equal((await reserve({ ...booking, databasePath, guest: 'C' })).status, 409);
      })],
    },
    'music-queue': {
      functional: [
        async () => {
          const { buildQueue } = await load('src/queue.mjs');
          const tracks = tracksFor(['A', 'A', 'B']);
          const seen = new Set();
          for (let first = 0; first < 3; first += 1) {
            for (let second = 0; second < 2; second += 1) {
              const choices = [first, second];
              const output = await buildQueue(tracks, 'uniform', () => choices.shift());
              assert.deepEqual(ids(output).sort(), ids(tracks));
              assert.equal(choices.length, 0);
              seen.add(ids(output).join(','));
            }
          }
          assert.equal(seen.size, 6);
          assert.deepEqual(ids(tracks), [0, 1, 2]);
        },
        async () => {
          const { buildQueue } = await load('src/queue.mjs');
          const tracks = tracksFor(['A', 'A', 'B', 'B', 'C', 'C']);
          const output = await buildQueue(tracks, 'variety', () => 0);
          assert.equal(repeated(output), 0);
          assert.deepEqual(ids(output).sort(), ids(tracks));
        },
      ],
      edge: [
        async () => {
          const { buildQueue } = await load('src/queue.mjs');
          const tracks = tracksFor(['A', 'A', 'A', 'A', 'B', 'C']);
          const output = await buildQueue(tracks, 'variety', () => 0);
          assert.equal(repeated(output), 1);
          assert.deepEqual(ids(output).sort(), ids(tracks));
        },
        async () => {
          const { buildQueue } = await load('src/queue.mjs');
          for (const mode of ['uniform', 'variety']) {
            for (const tracks of [[], tracksFor(['A'])]) {
              assert.deepEqual(await buildQueue(tracks, mode, () => 0), tracks);
            }
          }
        },
      ],
    },
    'payment-retry': {
      functional: [
        async () => {
          const { submitPayment } = await load('src/payments.mjs');
          const gateway = simulatedGateway({ loseReply: true });
          const request = { account: 'a', requestId: 'same', cents: 1200 };
          await assert.rejects(async () => submitPayment(gateway, request), /response lost/i);
          assert.equal((await submitPayment(gateway, request)).receiptId, 1);
          assert.equal(gateway.charges.size, 1);
        },
        async () => {
          const { submitPayment } = await load('src/payments.mjs');
          const gateway = simulatedGateway();
          const request = { account: 'a', requestId: 'same', cents: 1200 };
          await submitPayment(gateway, request);
          assert.equal((await submitPayment(gateway, { ...request, account: 'b' })).receiptId, 2);
          assert.equal(gateway.charges.size, 2);
        },
      ],
      edge: [async () => {
        const { submitPayment } = await load('src/payments.mjs');
        const gateway = simulatedGateway();
        const request = { account: 'a', requestId: 'same', cents: 1200 };
        await submitPayment(gateway, request);
        assert.equal((await submitPayment(gateway, { ...request, cents: 1300 })).status, 409);
        assert.equal(gateway.charges.size, 1);
      }],
    },
    'feed-cursor': {
      functional: [
        async () => {
          const { pageAfter } = await load('src/feed.mjs');
          const first = await pageAfter(rows, null, 2);
          assert.deepEqual(ids(first), [1, 8]);
          assert.deepEqual(ids(await pageAfter(inserted, first.at(-1), 2)), [6, 99]);
        },
        async () => {
          const { pageByOffset } = await load('src/feed.mjs');
          assert.deepEqual(ids(await pageByOffset(inserted, 2, 2)), [8, 6]);
        },
      ],
      edge: [
        async () => {
          const { pageAfter } = await load('src/feed.mjs');
          assert.deepEqual(ids(await pageAfter(inserted.filter(row => row.id !== 8), { timestamp: 9, id: 8 }, 2)), [6, 99]);
        },
        async () => {
          const { pageAfter } = await load('src/feed.mjs');
          assert.deepEqual(await pageAfter([], null, 2), []);
          const frozen = Object.freeze(rows.map(row => Object.freeze({ ...row })));
          assert.deepEqual(ids(await pageAfter(frozen, null, 2)), [1, 8]);
          assert.deepEqual(ids(frozen), [99, 6, 1, 8]);
        },
      ],
    },
    'feed-audit': {
      fixture: [async () => {
        const { listPage } = await load('src/feed.mjs');
        assert(ids(await listPage(rows, 0, 2)).includes(8));
        assert(ids(await listPage(inserted, 1, 2)).includes(8));
      }],
      decision: [
        () => {
          const answer = metadata.answer ?? '';
          assert.match(answer, /src[\\/]+feed\.mjs(?::|\s+lines?\s+|#L)[234]\b/i);
          for (const term of [/offset|page\s*\*\s*size/i, /insert|new (?:item|row|post)/i, /duplicat|repeat|twice/i,
            /cursor|keyset/i, /timestamp/i, /\b(?:unique )?id\b/i]) assert.match(answer, term);
        },
        () => assert.equal(metadata.workspaceUnchanged, true),
      ],
    },
    'shared-cents': {
      functional: [() => checkCents(1200, '$12.00')],
      edge: [async () => {
        await checkCents(-50, '-$0.50');
        await checkCents(0, '$0.00');
        await checkCents(12.5, Error);
      }],
      architecture: [
        async () => {
          for (const file of ['src/checkout.mjs', 'src/invoice.mjs']) {
            assert.match(await readFile(join(root, file), 'utf8'), /from\s+['"]\.\/currency\.mjs['"]/);
          }
        },
        () => assert.equal(metadata.policyUnchanged, true),
        () => {
          assert.equal(metadata.extraSourceFiles.length, 0);
          assert.equal(metadata.dependencyChanges, false);
        },
      ],
    },
    'document-ownership': {
      functional: [
        async () => {
          const { getDocument } = await load('src/documents.mjs');
          const document = { accountId: 'one', id: 'doc', body: 'fixture' };
          assert.deepEqual(await getDocument([document], 'one', 'doc'), document);
        },
        async () => {
          const { getDocument } = await load('src/documents.mjs');
          const item = { accountId: 'one', id: 'doc', body: 'fixture' };
          assert.equal(await getDocument([item], 'two', 'doc'), null);
          assert.equal(await getDocument([item], 'one', 'missing'), null);
        },
      ],
      edge: [async () => {
        const { getDocument } = await load('src/documents.mjs');
        const first = { accountId: 'one', id: 'shared', body: 'first' };
        const second = { accountId: 'two', id: 'shared', body: 'second' };
        assert.deepEqual(await getDocument([first, second], 'two', 'shared'), second);
      }],
    },
  };
}

export async function gradeCase(id, root, metadata) {
  const selected = nativeCases.find(scenario => scenario.id === id);
  if (!selected) throw new Error('Unknown evaluation fixture.');
  const checks = buildChecks({ root, metadata })[id];
  const results = {};
  for (const [group, definitions] of Object.entries(selected.checks)) {
    assert.equal(definitions.length, checks[group].length);
    results[group] = [];
    for (const [index, verify] of checks[group].entries()) {
      try {
        await verify();
        results[group].push({ name: definitions[index], passed: true });
      } catch (error) {
        results[group].push({ name: definitions[index], passed: false, detail: String(error?.message ?? error).slice(0, 350) });
      }
    }
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const results = await gradeCase(process.argv[2], process.argv[3], JSON.parse(input));
  console.log('SENIORMODE_GRADE_JSON ' + JSON.stringify(results));
}
