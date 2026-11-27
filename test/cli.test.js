import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { agents, installSkill, skillStatus, uninstallSkill } from '../src/install.js';

const cli = fileURLToPath(new URL('../bin/seniormode.js', import.meta.url));

function fixture(t) {
  const parent = realpathSync(tmpdir());
  const path = mkdtempSync(join(parent, 'seniormode-test-'));
  t.after(() => {
    const rel = relative(parent, realpathSync(path));
    assert(rel.startsWith('seniormode-test-') && !rel.includes(sep));
    rmSync(path, { recursive: true, force: true });
  });
  return path;
}

function run(args, cwd) {
  const output = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', timeout: 15000 });
  if (output.error) throw output.error;
  return output;
}

test('installed location can differ from the calling working directory', t => {
  const dir = fixture(t);
  const rows = run(['search', 'stable cursor pagination', '--json', '--limit', '1'], dir);
  assert.equal(rows.status, 0, rows.stderr);
  assert.equal(JSON.parse(rows.stdout)[0].id, 'cursor-pagination');
  for (const args of [['show', 'payment-idempotency', '--json'], ['checklist', 'music-shuffle'],
    ['compare', 'music-shuffle'], ['list', '--category', 'product', '--json']]) {
    const result = run(args, dir);
    assert.equal(result.status, 0, result.stderr);
    assert(JSON.parse(result.stdout));
  }
  assert.notEqual(run(['show', 'unknown-id'], dir).status, 0);
  assert.notEqual(run(['search', 'cache', '--limit', '2.5'], dir).status, 0);
});

test('installs, updates and removes each supported project skill layout', t => {
  const dir = fixture(t);
  assert.equal(agents.cursor, '.agents');
  mkdirSync(join(dir, '.cursor'));
  writeFileSync(join(dir, '.cursor', 'mcp.json'), '{"mcpServers":{}}\n');
  for (const [agent, folder] of Object.entries(agents)) {
    const state = installSkill(dir, agent);
    assert.equal(state.state, 'installed');
    assert.equal(state.path, join(dir, folder, 'skills', 'seniormode'));
    const skill = readFileSync(join(state.path, 'SKILL.md'), 'utf8');
    assert.match(skill, /name: seniormode/);
    assert(existsSync(join(state.path, 'references', 'knowledge', 'product', 'music-shuffle.md')));
    assert.deepEqual(skillStatus(dir, agent), state);
    assert.deepEqual(installSkill(dir, agent), state);
    assert.equal(installSkill(dir, agent, { update: true }).state, 'installed');
    assert.equal(uninstallSkill(dir, agent).state, 'absent');
    assert.equal(uninstallSkill(dir, agent).state, 'absent');
  }
  assert.equal(readFileSync(join(dir, '.cursor', 'mcp.json'), 'utf8'), '{"mcpServers":{}}\n');
});

test('unmanaged and user-edited skill files survive installers and removal', t => {
  const dir = fixture(t);
  const path = join(dir, agents.codex, 'skills', 'seniormode');
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, 'SKILL.md'), 'manual copy');
  assert.equal(skillStatus(dir, 'codex').state, 'unmanaged');
  assert.throws(() => installSkill(dir, 'codex'), /unmanaged/);
  assert.throws(() => uninstallSkill(dir, 'codex'), /unmanaged/);
  assert.equal(readFileSync(join(path, 'SKILL.md'), 'utf8'), 'manual copy');
  const official = installSkill(dir, 'claude-code');
  writeFileSync(join(official.path, 'user-notes.md'), 'keep these notes');
  assert.equal(skillStatus(dir, 'claude-code').state, 'modified');
  assert.throws(() => installSkill(dir, 'claude-code', { update: true }), /modified/);
  assert.throws(() => uninstallSkill(dir, 'claude-code'), /modified/);
  assert.equal(readFileSync(join(official.path, 'user-notes.md'), 'utf8'), 'keep these notes');
  const other = installSkill(dir, 'gemini-cli');
  mkdirSync(join(other.path, 'user-folder'));
  assert.equal(skillStatus(dir, 'gemini-cli').state, 'modified');
  assert.throws(() => uninstallSkill(dir, 'gemini-cli'), /modified/);
});
