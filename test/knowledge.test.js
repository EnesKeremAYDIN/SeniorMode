import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createKnowledge } from '../src/knowledge.js';
import { categories, formatPattern, parsePattern, readPatterns } from '../src/patterns.js';

test('loads the entire source corpus and preserves its structured contract', () => {
  const records = readPatterns();
  assert(records.length >= 100);
  assert.deepEqual([...new Set(records.map(r => r.category))].sort(), [...categories].sort());
  assert(records.every(r => r.sources.length > 0 && r.decisions.length >= 2 && r.checks.length >= 2));
  const sample = records.find(r => r.id === 'music-shuffle');
  assert.match(formatPattern(sample), /Fisher–Yates/);
  assert.match(formatPattern(sample), /## Verification/);
  assert.throws(() => parsePattern('---\nid: invalid\n---\nhello'), /must have required property/);
});

test('ranks practical queries, limits results and keeps filter syntax literal', t => {
  const index = createKnowledge();
  t.after(() => index.close());
  assert.equal(index.search('karışık çalma aynı sanatçı')[0].id, 'music-shuffle');
  assert.equal(index.search('double charge payment retry')[0].id, 'payment-idempotency');
  assert.equal(index.search('infinite scroll duplicates cursor pagination')[0].id, 'cursor-pagination');
  assert.deepEqual(index.search('the and to !!!'), []);
  assert.deepEqual(index.search('Xylophonenebulazoom'), []);
  assert(index.search('near "payment" -1') instanceof Array);
  assert(index.search('cache', { category: 'data', limit: 1 }).every(r => r.category === 'data'));
  assert.equal(index.search('cache', { limit: 1 }).length, 1);
  assert.throws(() => index.search('cache', { limit: 21 }), /Limit/);
  assert.throws(() => index.search('cache', { category: 'bad' }), /Unknown category/);
  assert.throws(() => index.get('../../private'), /Unknown pattern/);
  assert.throws(() => index.search('x'.repeat(513)), /512/);
});

test('metadata index links to the canonical records', () => {
  const catalog = new URL('../skills/seniormode/references/catalog/index.json', import.meta.url);
  const index = JSON.parse(readFileSync(catalog, 'utf8'));
  assert.deepEqual(index.map(r => r.id), readPatterns().map(r => r.id));
  for (const row of index) {
    const file = new URL(`../knowledge/${row.path}`, catalog);
    assert.equal(parsePattern(readFileSync(file, 'utf8')).id, row.id);
  }
});

test('full metadata phrases preserve focus while broad discovery remains available', t => {
  const index = createKnowledge();
  t.after(() => index.close());

  const focused = index.search('karışık çalma aynı sanatçı', { limit: 10 });
  assert.equal(focused[0].id, 'music-shuffle');
  assert(!focused.some(record => record.id === 'geometry-coordinate-systems'));
  assert(index.search('cache', { limit: 6 }).length > 1);
});
