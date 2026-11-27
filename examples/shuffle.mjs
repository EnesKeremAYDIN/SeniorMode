import { randomInt } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { adjacentArtistRepeats, uniformShuffle as shuffle, variedShuffle as shuffleForVariety } from './shuffle-algorithms.mjs';

export { adjacentArtistRepeats };

export function uniformShuffle(values, pick = randomInt) {
  return shuffle(values, pick);
}

export function variedShuffle(tracks, pick = randomInt) {
  return shuffleForVariety(tracks, pick);
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
