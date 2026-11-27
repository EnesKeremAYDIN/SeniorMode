import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pageAfter, pageByOffset } from '../examples/pagination.mjs';

test('the audit reproduces a duplicate and verifies a compound cursor across insertion', () => {
  const initial = [[10, 1], [9, 8], [9, 6], [8, 99]].map(([timestamp, id]) => ({ timestamp, id }));
  const first = pageAfter(initial, null, 2);
  const updated = [...initial, { timestamp: 12, id: 12 }];
  assert.deepEqual(first.map(r => r.id), [1, 8]);
  assert.deepEqual(pageByOffset(updated, 2, 2).map(r => r.id), [8, 6]);
  assert.deepEqual(pageAfter(updated, first.at(-1), 2).map(r => r.id), [6, 99]);
});
