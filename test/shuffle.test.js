import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shuffleComparison, uniformShuffle, variedShuffle } from '../examples/shuffle.mjs';
import { minimumArtistRepeats } from '../examples/shuffle-algorithms.mjs';

const fixtures = artists => artists.map((artist, id) => ({ artist, id }));
const ids = tracks => tracks.map(track => track.id).sort((a, b) => a - b);
const repeats = tracks => tracks.filter((track, i) => i && track.artist === tracks[i - 1].artist).length;

test('the named playlist preserves every song and illustrates the product trade-off', () => {
  const { tracks, randomComparator, uniform, varied } = shuffleComparison();
  for (const queue of [randomComparator, uniform, varied]) assert.deepEqual(ids(queue), ids(tracks));
  assert.deepEqual(tracks.map(track => track.id), [0, 1, 2, 3, 4, 5]);
  assert.equal(minimumArtistRepeats(tracks), 0);
  assert.equal(repeats(randomComparator), 3);
  assert.equal(repeats(uniform), 1);
  assert.equal(repeats(varied), 0);
});

test('the Fisher–Yates demo reaches each permutation once for all bounded draws on three items', () => {
  const outcomes = new Set();
  for (let first = 0; first < 3; first += 1) {
    for (let second = 0; second < 2; second += 1) {
      const draws = [first, second];
      outcomes.add(uniformShuffle([0, 1, 2], () => draws.shift()).join(''));
    }
  }
  assert.equal(outcomes.size, 6);
});

test('variety keeps every ID and avoids adjacent repeats when the groups permit it', () => {
  const tracks = fixtures(['Ada', 'Ada', 'Ada', 'Bora', 'Bora', 'Cem']);
  const actual = variedShuffle(tracks, () => 0);
  assert.deepEqual(ids(actual), ids(tracks));
  assert.equal(repeats(actual), 0);
  assert.deepEqual(tracks.map(track => track.id), [0, 1, 2, 3, 4, 5]);
});

test('variety covers dominant groups, singleton inputs, and empty playlists', () => {
  const tracks = fixtures(['Ada', 'Ada', 'Ada', 'Ada', 'Bora', 'Cem']);
  const actual = variedShuffle(tracks, limit => limit - 1);
  assert.deepEqual(ids(actual), ids(tracks));
  assert.equal(repeats(actual), 1);
  assert.equal(minimumArtistRepeats(tracks), 1);
  assert.equal(minimumArtistRepeats([]), 0);
  assert.deepEqual(variedShuffle(tracks.slice(0, 1)), tracks.slice(0, 1));
  assert.deepEqual(variedShuffle([]), []);
});
