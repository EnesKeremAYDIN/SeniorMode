import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { discoveryCases, nativeCases } from '../benchmarks/native-cases.js';
import { gradeCase } from '../benchmarks/native-grade.js';
import { readAgentTrace } from '../benchmarks/native-trace.js';

const module = name => JSON.stringify(new URL('../examples/' + name, import.meta.url).href);
const known = {
  'greenfield-booking': {
    'src/bookings.mjs': 'import { openReservations, reserve as store } from ' + module('reservation.mjs') + ';\n'
      + 'export function reserve({ databasePath, ...request }) { const db = openReservations(databasePath);'
      + ' try { return store(db, request); } finally { db.close(); } }\n',
  },
  'music-queue': {
    'src/queue.mjs': 'import { uniformShuffle, variedShuffle } from ' + module('shuffle.mjs') + ';\n'
      + "export function buildQueue(tracks, mode, pick) { return mode === 'uniform' ? uniformShuffle(tracks, pick) : variedShuffle(tracks, pick); }\n",
  },
  'payment-retry': {
    'src/payments.mjs': 'export async function submitPayment(gateway, { account, requestId, cents }) {\n'
      + '  return gateway.charge({ key: JSON.stringify([account, requestId]), cents });\n}\n',
  },
  'feed-cursor': { 'src/feed.mjs': 'export { pageAfter, pageByOffset } from ' + module('pagination.mjs') + ';\n' },
  'feed-audit': {},
  'shared-cents': {
    'src/checkout.mjs': "import { formatCents } from './currency.mjs';\nexport const checkoutLabel = formatCents;\n",
    'src/invoice.mjs': "import { formatCents } from './currency.mjs';\nexport const invoiceLabel = formatCents;\n",
  },
  'document-ownership': {
    'src/documents.mjs': 'export function getDocument(documents, accountId, documentId) {\n'
      + ' return documents.find(item => item.accountId === accountId && item.id === documentId) ?? null;\n}\n',
  },
};
const report = 'src/feed.mjs:4 uses an offset boundary. Inserting a new post shifts the page and repeats an item.'
  + ' Use a stable timestamp and unique ID cursor and verify a new insert between two page reads.';

async function materialize(root, files) {
  for (const [path, contents] of Object.entries(files)) {
    const destination = join(root, path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, contents);
  }
}

test('native agent cases cover the requested skills without naming a skill in the prompts', () => {
  const covered = new Set(nativeCases.flatMap(item => item.tags));
  for (const tag of ['greenfield', 'add-feature', 'find-bug', 'architecture-improvement', 'music-shuffle',
    'reservation-concurrency', 'payment-idempotency', 'feed-pagination', 'defensive-security', 'reuse', 'anti-overengineering']) {
    assert(covered.has(tag), tag);
  }
  assert.equal(new Set(nativeCases.map(item => item.id)).size, nativeCases.length);
  assert(nativeCases.every(item => !/seniormode|SKILL\.md/i.test(item.prompt)));
});

test('discovery lists unrestricted prompts and a separate reviewer rubric', () => {
  const runner = fileURLToPath(new URL('../benchmarks/agent-benchmark.js', import.meta.url));
  const list = track => JSON.parse(execFileSync(process.execPath, [runner, '--track', track], { encoding: 'utf8' }));
  assert.deepEqual(list('implementation').map(item => item.id), nativeCases.map(item => item.id));
  const discovery = list('discovery');
  assert.deepEqual(discovery.map(item => item.id), discoveryCases.map(item => item.id));
  assert(discovery.every(item => item.mode === 'discovery' && item.records.length && item.rubric.length));
  assert(discoveryCases.every(item => !/seniormode|Fisher.Yates|idempoten|concurren|atomic|permutat/i.test(item.prompt)));
  assert.equal(list('all').length, discoveryCases.length + nativeCases.length);
});

test('native trace distinguishes successful file reads from mere mentions and tracks usage and test events', () => {
  const event = (id, command, output, exitCode = 0) => ({
    type: 'item.completed',
    item: { id, type: 'command_execution', status: 'completed', command, aggregated_output: output, exit_code: exitCode },
  });
  const log = [
    event('mention', 'rg .agents/skills/seniormode/SKILL.md', '.agents/skills/seniormode/SKILL.md'),
    event('skill', 'Get-Content .agents\\skills\\seniormode\\SKILL.md', '---\nname: seniormode\n---'),
    event('failed', 'cat references/knowledge/backend/cursor-pagination.md', 'id: cursor-pagination', 1),
    event('record', 'cat references/knowledge/backend/cursor-pagination.md', '---\nid: "cursor-pagination"\n---'),
    event('test', 'node --test', '', 1),
    { type: 'item.completed', item: { type: 'agent_message', text: 'Plain-language explanation' } },
    { type: 'turn.completed', usage: { input_tokens: 17, output_tokens: 4 } },
  ].map(row => JSON.stringify(row)).join('\n');
  const result = readAgentTrace(log, 'cursor-pagination');
  assert.equal(result.evidence.skillOpened, true);
  assert.deepEqual(result.evidence.recordsOpened, ['cursor-pagination']);
  assert.equal(result.evidence.relevantRecordOpened, true);
  assert.deepEqual(readAgentTrace(log, ['music-shuffle', 'cursor-pagination']).evidence.relevantRecordsOpened, ['cursor-pagination']);
  assert.deepEqual(result.evidence.observedTests, [{ exitCode: 1 }]);
  assert.equal(result.usage.input_tokens, 17);
  assert.equal(readAgentTrace(JSON.stringify({ type: 'error', message: '429 rate limit' }), 'cursor-pagination').providerLimited, true);
  assert.equal(readAgentTrace(JSON.stringify(event('failed', 'cat references/knowledge/backend/cursor-pagination.md', 'id: "cursor-pagination"', 1)), 'cursor-pagination').evidence.relevantRecordOpened, false);
});

test('Discovery trace distinguishes MCP candidates from the records, standards and workflows opened', () => {
  const call = (tool, structured_content, status = 'completed', server = 'seniormode') => ({
    type: 'item.completed',
    item: { type: 'mcp_tool_call', server, tool, arguments: { id: structured_content.id },
      status, result: { structured_content } },
  });
  const search = call('search_patterns', { patterns: [{ id: 'music-shuffle' }, { id: 'payment-idempotency' }] });
  const opened = call('get_pattern', { id: 'music-shuffle', body: 'A complete record.' });
  const failed = call('get_pattern', { id: 'payment-idempotency', body: 'ignored' }, 'failed');
  const unrelated = call('get_pattern', { id: 'cursor-pagination', body: 'ignored' }, 'completed', 'another-server');
  const standards = call('list_standards', { standards: [{ id: 'data' }, { id: 'reliability' }] });
  const standard = call('get_standard', { id: 'data', body: 'Data guidance' });
  const invalidStandard = call('get_standard', { id: 'reliability', body: '' });
  const workflow = call('get_workflow', { id: 'build', body: 'Build guidance' });
  const mismatch = call('get_workflow', { id: 'audit', body: 'Audit guidance' });
  mismatch.item.arguments.id = 'invalid';
  const trace = readAgentTrace([search, opened, failed, unrelated, standards, standard, invalidStandard, workflow, mismatch]
    .map(row => JSON.stringify(row)).join('\n'),
    ['music-shuffle', 'payment-idempotency', 'cursor-pagination']);
  assert.equal(trace.evidence.mcpUsed, true);
  assert.deepEqual(trace.evidence.recordsFound, ['music-shuffle', 'payment-idempotency']);
  assert.deepEqual(trace.evidence.relevantRecordsOpened, ['music-shuffle']);
  assert.deepEqual(trace.evidence.standardsFound, ['data', 'reliability']);
  assert.deepEqual(trace.evidence.standardsOpened, ['data']);
  assert.deepEqual(trace.evidence.workflowsOpened, ['build']);
  assert.deepEqual(readAgentTrace(JSON.stringify(search), 'music-shuffle').evidence.recordsOpened, []);
});

test('each native grader accepts a trusted solution and rejects an unmodified or incomplete fixture', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'seniormode-native-fixtures-'));
  t.after(() => rm(folder, { recursive: true }));
  for (const scenario of nativeCases) {
    const correct = join(folder, scenario.id, 'correct');
    const broken = join(folder, scenario.id, 'broken');
    await materialize(correct, { ...scenario.files, ...known[scenario.id] });
    await materialize(broken, scenario.files);
    const metadata = {
      answer: report, workspaceUnchanged: true, policyUnchanged: true, extraSourceFiles: [], dependencyChanges: false,
    };
    const pass = await gradeCase(scenario.id, correct, metadata);
    assert(Object.values(pass).flat().every(check => check.passed),
      scenario.id + ': ' + JSON.stringify(pass));
    const fail = await gradeCase(scenario.id, broken, { ...metadata, answer: '' });
    assert(Object.values(fail).flat().some(check => !check.passed), scenario.id + ' passed its negative fixture');
  }
});
