export function uniformShuffle(values, pick) {
  const result = values.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = pick(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function variedShuffle(tracks, pick) {
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

export function adjacentArtistRepeats(queue) {
  return queue.slice(1).filter((track, index) => track.artist === queue[index].artist).length;
}

export function minimumArtistRepeats(tracks) {
  const groups = Map.groupBy(tracks, track => track.artist);
  const largest = Math.max(0, ...[...groups.values()].map(group => group.length));
  return Math.max(0, largest - (tracks.length - largest) - 1);
}
