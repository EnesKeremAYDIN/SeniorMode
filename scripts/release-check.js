import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { locales } from './document-locales.js';
import { markdownTree, validateDocumentLinks } from './documents.js';

const repo = fileURLToPath(new URL('../', import.meta.url));
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run this check with npm run release:check.');
const parent = realpathSync(tmpdir());
const fixture = mkdtempSync(join(parent, 'seniormode-release-'));

function run(file, args, cwd, stdio = 'pipe') {
  return execFileSync(process.execPath, [file, ...args], { cwd, stdio, encoding: 'utf8', timeout: 120000 });
}

try {
  run(npm, ['pack', '--silent', '--pack-destination', fixture], repo, 'inherit');
  const archives = readdirSync(fixture).filter(name => name.endsWith('.tgz'));
  assert.equal(archives.length, 1, 'Expected one packed archive.');
  const consumer = join(fixture, 'consumer');
  mkdirSync(consumer);
  writeFileSync(join(consumer, 'package.json'), '{"name":"seniormode-smoke-consumer","private":true}\n');
  run(npm, ['install', '--prefix', consumer, '--no-audit', '--no-fund', join(fixture, archives[0])], consumer, 'inherit');
  const sourceManifest = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
  const installed = join(consumer, 'node_modules', sourceManifest.name);
  const cli = join(installed, sourceManifest.bin.seniormode);
  assert.equal(JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8')).version, sourceManifest.version);

  for (const path of [
    'README.md', '.github/CONTRIBUTING.md', '.github/ACCESSIBILITY.md',
    '.github/CODE_OF_CONDUCT.md', '.github/SECURITY.md', 'LICENSE-CONTENT.md',
    'skills/seniormode/references/knowledge/product/music-shuffle.md',
    'skills/seniormode/references/knowledge/concurrency/payment-idempotency.md',
    'assets/brand/logo.svg', 'assets/brand/social-preview.png',
    'examples/reservation.mjs', 'examples/payment-retry.mjs', 'examples/shuffle.mjs', 'examples/pagination.mjs',
  ]) assert(existsSync(join(installed, path)), `Missing packaged file: ${path}`);
  assert(!readdirSync(join(installed, 'assets')).some(name => /^(?:shuffle|workflow)-demo.*\.gif$/.test(name)));
  for (const folder of ['scripts', 'benchmarks', 'test', 'docs/patterns']) {
    assert(!existsSync(join(installed, folder)), `Unexpected maintainer files in package: ${folder}`);
  }
  const translations = join(installed, 'docs', 'i18n');
  const localized = Object.keys(locales).filter(locale => locale !== 'en').sort();
  assert.deepEqual(readdirSync(translations).sort(), localized);
  for (const locale of localized) {
    assert.deepEqual(readdirSync(join(translations, locale)), ['README.md']);
  }

  validateDocumentLinks(markdownTree(installed), installed);
  const search = JSON.parse(run(cli, ['search', 'kaldığı yerden dosya yükleme', '--limit', '1', '--json'], consumer));
  assert.equal(search[0]?.id, 'resumable-uploads');
  const entries = JSON.parse(run(cli, ['list', '--json'], consumer));
  const index = JSON.parse(readFileSync(join(repo, 'skills', 'seniormode', 'references', 'catalog', 'index.json'), 'utf8'));
  assert.deepEqual(entries.map(record => record.id), index.map(record => record.id));
  const installedSkill = JSON.parse(run(cli, ['install', '--agent', 'codex', '--json'], consumer));
  assert.equal(installedSkill.state, 'installed');
  assert.equal(installedSkill.version, sourceManifest.version);
  assert(existsSync(join(installedSkill.path, 'references', 'knowledge', 'product', 'music-shuffle.md')));
  assert(existsSync(join(installedSkill.path, 'references', 'standards', 'greenfield.md')));
  assert(existsSync(join(installedSkill.path, 'LICENSE-CONTENT.md')));
  const updatedSkill = JSON.parse(run(cli, ['update', '--agent', 'codex', '--json'], consumer));
  assert.equal(updatedSkill.version, sourceManifest.version);
  run(cli, ['uninstall', '--agent', 'codex', '--json'], consumer);
  assert(!existsSync(installedSkill.path));

  const client = new Client({ name: 'seniormode-package-check', version: sourceManifest.version });
  try {
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [cli, 'mcp'], cwd: consumer }));
    assert.equal((await client.listTools()).tools.length, 7);
    const standards = await client.callTool({ name: 'list_standards' });
    assert.equal(standards.structuredContent.standards.length, 16);
    const standard = await client.callTool({ name: 'get_standard', arguments: { id: 'greenfield' } });
    assert.equal(standard.structuredContent.body,
      readFileSync(join(installed, 'skills/seniormode/references/standards/greenfield.md'), 'utf8').trimEnd());
    const workflow = await client.callTool({ name: 'get_workflow', arguments: { id: 'build' } });
    assert.equal(workflow.structuredContent.body,
      readFileSync(join(installed, 'skills/seniormode/references/build.md'), 'utf8').trimEnd());
  } finally {
    await client.close();
  }
  console.log(`Packed ${sourceManifest.version} verified in a fresh project. Checked ${entries.length} records, documentation, skill lifecycle and MCP guidance.`);
} finally {
  const directory = relative(parent, realpathSync(fixture));
  if (!directory.startsWith('seniormode-release-') || directory.includes(sep)) {
    throw new Error('Unexpected temporary package directory.');
  }
  rmSync(fixture, { recursive: true, force: true, maxRetries: 4, retryDelay: 150 });
}
