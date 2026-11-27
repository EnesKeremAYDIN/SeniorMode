import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shuffleComparison } from '../examples/shuffle.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const [output] = process.argv.slice(2);
if (!output) throw new Error('Usage: node scripts/build-shuffle-lab.js <output-directory>');

const site = resolve(output);
const demo = join(site, 'shuffle');
mkdirSync(demo, { recursive: true });
for (const file of ['index.html', 'style.css', 'lab.js']) {
  copyFileSync(join(root, 'demo', 'shuffle', file), join(demo, file));
}
copyFileSync(join(root, 'assets', 'brand', 'logo.svg'), join(demo, 'logo.svg'));
copyFileSync(join(root, 'examples', 'shuffle-algorithms.mjs'), join(demo, 'shuffle-algorithms.js'));

const baseline = shuffleComparison();
const artistHeavy = [
  ...baseline.tracks.filter(track => track.artist === 'Eminem'),
  { id: 6, artist: 'Eminem', title: 'Stan' },
  { id: 7, artist: 'Eminem', title: 'Mockingbird' },
  ...baseline.tracks.filter(track => ['Hotline Bling', 'Save Your Tears'].includes(track.title)),
];
writeFileSync(join(demo, 'playlists.js'), 'export const playlists = ' + JSON.stringify({ baseline, artistHeavy }) + ';\n');
writeFileSync(join(site, 'index.html'), [
  '<!doctype html><html lang="en"><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta http-equiv="refresh" content="0; url=./shuffle/">',
  '<title>SeniorMode Shuffle Lab</title><a href="./shuffle/">Open the SeniorMode Shuffle Lab</a></html>',
].join('\n'));

console.log('Shuffle Lab built at ' + demo);
