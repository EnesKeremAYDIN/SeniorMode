import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { formatPattern, knowledgeRoot, parsePattern, readPatterns } from '../src/patterns.js';
import { join, posix } from 'node:path';

const expanded = readFileSync(new URL(
  '../skills/seniormode/references/knowledge/algorithms/binary-search.md',
  import.meta.url,
), 'utf8').replaceAll('\r\n', '\n');
const requiredOnly = expanded.split('\n## Implementation guidance')[0].trimEnd();

test('optional record sections preserve metadata and render in the intended order', () => {
  const before = parsePattern(requiredOnly);
  const after = parsePattern(expanded);
  assert.deepEqual({ ...after, body: before.body }, before);
  assert.doesNotMatch(formatPattern(before), /## Implementation guidance/);
  const rendered = formatPattern(after);
  assert(rendered.indexOf('## Verification') < rendered.indexOf('## Implementation guidance'));
  assert(rendered.indexOf('## Implementation guidance') < rendered.indexOf('## Sources'));
});

test('optional sections can contain fenced examples with heading-like code', () => {
  const examples = [
    '~~~sh',
    '## Prepare a reproducible test input before checking the bound',
    'echo lower-bound',
    '~~~',
  ].join('\n');
  const record = parsePattern(`${requiredOnly}\n\n## Worked example\n\n${examples}`);
  assert(formatPattern(record).includes(examples));
});

test('duplicate, reserved, and empty optional sections fail validation', () => {
  const paragraph = 'A focused paragraph explains a verifiable detail.';
  assert.throws(() => parsePattern(`${expanded}\n## Implementation guidance\n\n${paragraph}`),
    /unexpected or duplicate optional section/);
  assert.throws(() => parsePattern(`${requiredOnly}\n\n## Sources\n\n${paragraph}`),
    /unexpected or duplicate optional section/);
  assert.throws(() => parsePattern(`${requiredOnly}\n\n## Edge cases\n\nToo short.`),
    /incomplete Edge cases section/);
});

test('canonical files expose readable details and relative sources without adding generated text to the runtime body', () => {
  const records = readPatterns();
  const byId = new Map(records.map(record => [record.id, record]));
  for (const record of records) {
    const raw = readFileSync(join(knowledgeRoot, record.path), 'utf8');
    assert(raw.includes('# ' + record.title));
    assert(raw.includes('## Decision rules') && raw.includes('## Verification') && raw.includes('## Sources'));
    for (const source of record.sources) assert(raw.includes(`[${source.title}](${source.url})`));
    for (const id of record.related ?? []) {
      const target = byId.get(id);
      assert(raw.includes(`[${target.title}](${posix.relative(record.category, target.path)})`));
    }
    assert.doesNotMatch(record.body, /Generated record (?:title|details)/);
  }
});
