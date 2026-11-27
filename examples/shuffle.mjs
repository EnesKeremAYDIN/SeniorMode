import { randomInt } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function uniformShuffle(values, pick = randomInt) {
  const result = values.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = pick(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function variedShuffle(tracks, pick = randomInt) {
  const groups = Map.groupBy(tracks, track => track.artist);
  for (const [artist, queue] of groups) groups.set(artist, uniformShuffle(queue, pick));
  const result = [];
  let previous;
  while (groups.size) {
    const candidates = [...groups].filter(([artist]) => artist !== previous || groups.size === 1);
    const largest = Math.max(...candidates.map(([, queue]) => queue.length));
    const tied = candidates.filter(([, queue]) => queue.length === largest);
    const [artist, queue] = tied[pick(tied.length)];
    result.push(queue.pop());
    if (!queue.length) groups.delete(artist);
    previous = artist;
  }
  return result;
}

const sampleTracks = [
  ['Eminem', 'Lose Yourself'], ['Eminem', 'Without Me'],
  ['Drake', "God's Plan"], ['Drake', 'Hotline Bling'],
  ['The Weeknd', 'Blinding Lights'], ['The Weeknd', 'Save Your Tears'],
];

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function shuffleComparison() {
  const tracks = sampleTracks.map(([artist, title], id) => ({ id, artist, title }));
  const shortcutDraw = seededRandom(6);
  const uniformDraw = seededRandom(6);
  const varietyDraw = seededRandom(6);
  return {
    tracks,
    randomComparator: [...tracks].sort(() => shortcutDraw() - 0.5),
    uniform: uniformShuffle(tracks, limit => Math.floor(uniformDraw() * limit)),
    varied: variedShuffle(tracks, limit => Math.floor(varietyDraw() * limit)),
  };
}

export function adjacentArtistRepeats(queue) {
  return queue.slice(1).filter((track, index) => track.artist === queue[index].artist).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { randomComparator, uniform, varied } = shuffleComparison();
  const rows = {
    'Random comparator (shortcut)': randomComparator,
    'Fisher–Yates (equal odds)': uniform,
    'Artist variety': varied,
  };
  for (const [label, queue] of Object.entries(rows)) {
    const repeats = adjacentArtistRepeats(queue);
    console.log(`\n${label} · ${repeats} adjacent repeats`);
    for (const track of queue) console.log(`  ${track.artist} · ${track.title}`);
  }
}
