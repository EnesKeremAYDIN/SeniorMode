import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { benchmarkMcpOverrides } from '../benchmarks/native-mcp.js';
import { skillRoot } from '../src/patterns.js';

const cli = fileURLToPath(new URL('../bin/seniormode.js', import.meta.url));

test('MCP stdio exposes all seven read-only tools and opens canonical guidance on demand', { timeout: 15000 }, async t => {
  const overrides = benchmarkMcpOverrides();
  const command = JSON.parse(overrides[1].slice('mcp_servers.seniormode.command='.length));
  const args = JSON.parse(overrides[3].slice('mcp_servers.seniormode.args='.length));
  const transport = new StdioClientTransport({ command, args, stderr: 'pipe' });
  const client = new Client({ name: 'seniormode-tests', version: '1.0.0' });
  t.after(() => client.close());
  const errors = [];
  transport.stderr.on('data', chunk => errors.push(String(chunk)));
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(tool => tool.name).sort(),
    ['compare_approaches', 'get_checklist', 'get_pattern', 'get_standard', 'get_workflow', 'list_standards', 'search_patterns']);
  assert(tools.every(tool => tool.annotations?.readOnlyHint && !tool.annotations.destructiveHint));
  assert(tools.every(tool => tool.outputSchema?.type === 'object'));
  for (const name of ['list_standards', 'get_standard', 'get_workflow']) {
    assert.equal(tools.find(tool => tool.name === name).inputSchema.additionalProperties, false, name);
  }

  const lookup = await client.callTool({ name: 'search_patterns', arguments: { query: 'stable cursor pagination', limit: 1 } });
  assert.equal(lookup.structuredContent.patterns[0].id, 'cursor-pagination');
  const natural = await client.callTool({ name: 'search_patterns', arguments: {
    query: 'ödeme yanıtı kayboldu tekrar deneyince iki kere ücret çekiliyor', category: 'concurrency', limit: 1,
  } });
  assert.equal(natural.structuredContent.patterns[0].id, 'payment-idempotency');
  const empty = await client.callTool({ name: 'search_patterns', arguments: { query: 'unmatchablezzxy123' } });
  assert.deepEqual(empty.structuredContent.patterns, []);
  const malformed = await client.callTool({ name: 'search_patterns', arguments: { query: '   ' } });
  assert.equal(malformed.isError, true);
  const id = 'music-shuffle';
  const record = (await client.callTool({ name: 'get_pattern', arguments: { id } })).structuredContent;
  assert.equal(record.id, id);
  const comparison = await client.callTool({ name: 'compare_approaches', arguments: { id } });
  assert.deepEqual(comparison.structuredContent.decisions, record.decisions);
  const checklist = await client.callTool({ name: 'get_checklist', arguments: { id } });
  assert.deepEqual(checklist.structuredContent.checks, record.checks);
  const missing = await client.callTool({ name: 'get_pattern', arguments: { id: 'missing' } });
  assert.equal(missing.isError, true);

  const list = (await client.callTool({ name: 'list_standards' })).structuredContent.standards;
  const standardFiles = readdirSync(join(skillRoot, 'references/standards')).filter(name => name.endsWith('.md'));
  assert.equal(list.length, 16);
  assert.deepEqual(list.map(({ id }) => id + '.md').sort(), standardFiles.sort());
  assert(list.every(standard => standard.title && standard.when && !Object.hasOwn(standard, 'body')));
  for (const standard of list) {
    const { structuredContent, content } = await client.callTool({ name: 'get_standard', arguments: { id: standard.id } });
    const body = readFileSync(join(skillRoot, 'references/standards', standard.id + '.md'), 'utf8').trimEnd();
    assert.deepEqual(structuredContent, { ...standard, body });
    assert.equal(content[0].text, body);
  }
  for (const [id, path] of Object.entries({ build: 'references/build.md', audit: 'references/audit.md', principles: 'SKILL.md' })) {
    const { structuredContent, content } = await client.callTool({ name: 'get_workflow', arguments: { id } });
    const body = readFileSync(join(skillRoot, path), 'utf8').trimEnd();
    assert.deepEqual(structuredContent, { id, path, title: structuredContent.title, body });
    assert.equal(content[0].text, body);
  }
  for (const name of ['get_standard', 'get_workflow']) {
    for (const id of ['missing', '../SKILL.md', '..\\SKILL.md', '/etc/passwd', 'C:\\secret', '%2e%2e%2fSKILL.md', 'constructor']) {
      const invalid = await client.callTool({ name, arguments: { id } });
      assert.equal(invalid.isError, true, `${name} ${id}`);
      assert.equal(invalid.structuredContent, undefined);
      assert(!invalid.content[0].text.includes(skillRoot));
    }
  }
  for (const [name, args] of [
    ['list_standards', { path: 'SKILL.md' }],
    ['get_standard', { id: 'architecture', path: 'SKILL.md' }],
    ['get_workflow', { id: 'build', path: 'SKILL.md' }],
  ]) {
    assert.equal((await client.callTool({ name, arguments: args })).isError, true, name);
  }
  assert.deepEqual(errors, []);
});

test('standards-based MCP 2025-11-25 clients can initialize and call tools over stdio', { timeout: 10000 }, async t => {
  const child = spawn(process.execPath, [cli, 'mcp'], { stdio: ['pipe', 'pipe', 'pipe'] });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  const output = createInterface({ input: child.stdout, crlfDelay: Infinity })[Symbol.asyncIterator]();
  const send = (method, params, id) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  const read = async id => {
    const line = await output.next();
    assert(!line.done);
    const decoded = JSON.parse(line.value);
    assert.equal(decoded.id, id);
    return decoded;
  };
  send('initialize', { protocolVersion: '2025-11-25', capabilities: {},
    clientInfo: { name: 'mcp-revision-test', version: '1.0.0' } }, 1);
  const { result } = await read(1);
  assert.equal(result.protocolVersion, '2025-11-25');
  assert.match(result.instructions, /Identify risks.*get_workflow.*standards.*search_patterns/);
  send('notifications/initialized');
  send('tools/list', {}, 2);
  assert.equal((await read(2)).result.tools.length, 7);
  send('tools/call', { name: 'get_checklist', arguments: { id: 'music-shuffle' } }, 3);
  assert((await read(3)).result.structuredContent.checks.length >= 2);
  const exited = once(child, 'exit');
  child.stdin.end();
  assert.deepEqual(await exited, [0, null]);
});
