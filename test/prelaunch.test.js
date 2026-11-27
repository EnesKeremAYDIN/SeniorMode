import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const script = fileURLToPath(new URL('../scripts/check-release-files.js', import.meta.url));
const check = directory => spawnSync(process.execPath, [script, '--snapshot', directory], { encoding: 'utf8' });

test('the snapshot check reports files and reasons while keeping credential-like values out of output', t => {
  const directory = mkdtempSync(join(tmpdir(), 'seniormode-candidate-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  writeFileSync(join(directory, 'README.md'), 'A local project example.\n');
  writeFileSync(join(directory, '.env.example'), 'DUMMY=\n');
  assert.equal(check(directory).status, 0);

  const simulated = 'gh' + 'p_' + 'x'.repeat(32);
  writeFileSync(join(directory, 'fixture.md'), simulated + '\n');
  writeFileSync(join(directory, '.env.local'), 'DUMMY=1\n');
  writeFileSync(join(directory, '.env.development.local'), 'DUMMY=1\n');
  const result = check(directory);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GitHub token: fixture\.md/);
  assert.match(result.stderr, /private or generated file: \.env\.local/);
  assert.match(result.stderr, /private or generated file: \.env\.development\.local/);
  assert(!result.stderr.includes(simulated));
});
