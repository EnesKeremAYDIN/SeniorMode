import { adjacentArtistRepeats, minimumArtistRepeats, uniformShuffle, variedShuffle } from './shuffle-algorithms.js';
import { playlists } from './playlists.js';

const methods = [
  { key: 'randomComparator', name: 'Random sort', detail: 'Calls Math.random() during sort.', tone: 'shortcut' },
  { key: 'uniform', name: 'Fisher–Yates', detail: 'Gives every order an equal chance.', tone: 'uniform' },
  { key: 'varied', name: 'Artist-aware', detail: 'Spaces out tracks by the same artist.', tone: 'varied' },
];
const artistColors = new Map([['Eminem', 'lime'], ['Drake', 'lilac'], ['The Weeknd', 'blue']]);
const presetButtons = [...document.querySelectorAll('[data-preset]')];
const mix = document.querySelector('#mix');
const minimum = document.querySelector('#minimum');
const queueTemplate = document.querySelector('#queue-template');
const queues = document.querySelector('#queues');
const runLabel = document.querySelector('#run-label');
const announcement = document.querySelector('#announcement');
const word = new Uint32Array(1);
let preset = 'balanced';
let run = 0;

function pick(limit) {
  const wordRange = 2 ** 32;
  const boundary = wordRange - (wordRange % limit);
  do {
    crypto.getRandomValues(word);
  } while (word[0] >= boundary);
  return word[0] % limit;
}

function artistDot(artist) {
  const dot = document.createElement('span');
  dot.className = 'artist-dot ' + artistColors.get(artist);
  dot.setAttribute('aria-hidden', 'true');
  return dot;
}

function render(current, announce) {
  const groups = Map.groupBy(current.tracks, track => track.artist);
  const floor = minimumArtistRepeats(current.tracks);
  mix.replaceChildren(...Array.from(artistColors.keys(), artist => {
    const item = document.createElement('li');
    const count = document.createElement('span');
    count.className = 'mix-count';
    count.textContent = groups.get(artist).length;
    item.append(artistDot(artist), artist, count);
    return item;
  }));
  minimum.textContent = floor === 0
    ? 'This playlist can play with zero adjacent repeats.'
    : 'At least one repeat is unavoidable. There are four Eminem tracks and two others.';
  runLabel.textContent = run === 0 ? 'Sample run' : 'Shuffle ' + run;
  for (const button of presetButtons) button.setAttribute('aria-pressed', button.dataset.preset === preset);

  const report = [];
  queues.replaceChildren(...methods.map(({ key, name, detail, tone }) => {
    const card = queueTemplate.content.cloneNode(true);
    card.querySelector('article').classList.add(tone);
    card.querySelector('h3').textContent = name;
    card.querySelector('.method-detail').textContent = detail;
    const queue = current[key];
    const repeats = adjacentArtistRepeats(queue);
    card.querySelector('.repeat-count').textContent = repeats;
    report.push(name + ': ' + repeats);
    const tracks = card.querySelector('.tracks');
    queue.forEach((track, index) => {
      const item = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = track.title;
      const artist = document.createElement('span');
      artist.textContent = track.artist;
      const words = document.createElement('span');
      words.className = 'track-name';
      words.append(name, artist);
      item.append(artistDot(track.artist), words);
      if (track.artist === queue[index - 1]?.artist) {
        const repeat = document.createElement('span');
        repeat.className = 'repeat';
        repeat.textContent = 'Repeat';
        item.append(repeat);
      }
      tracks.append(item);
    });
    return card;
  }));
  if (announce) announcement.textContent = runLabel.textContent + '. Adjacent repeats. ' + report.join(', ') + '.';
}

function shuffle() {
  const tracks = preset === 'balanced' ? playlists.baseline.tracks : playlists.artistHeavy;
  run += 1;
  render({
    tracks,
    randomComparator: [...tracks].sort(() => Math.random() - 0.5),
    uniform: uniformShuffle(tracks, pick),
    varied: variedShuffle(tracks, pick),
  }, true);
}

function reset(announce) {
  preset = 'balanced';
  run = 0;
  render(playlists.baseline, announce);
}

for (const button of presetButtons) {
  button.addEventListener('click', () => {
    if (button.dataset.preset === preset) return;
    if (button.dataset.preset === 'balanced') {
      reset(true);
    } else {
      preset = button.dataset.preset;
      shuffle();
    }
  });
}
document.querySelector('#reshuffle').addEventListener('click', shuffle);
document.querySelector('#reset').addEventListener('click', () => reset(true));
reset(false);
