import { readFileSync } from 'node:fs';

export function validateDirectoryCopy(locale, records, rows) {
  if (!Array.isArray(rows)) throw new Error(locale + ': Directory translations must be an array');
  const ids = new Set(records.map(({ id }) => id));
  const copy = new Map();
  for (const row of rows) {
    if (!Array.isArray(row) || row.length !== 3 || row.some(value => typeof value !== 'string' || !value.trim())) {
      throw new Error(locale + ': expected a Directory record ID, title and problem');
    }
    const [id, title, problem] = row;
    if (!ids.has(id)) throw new Error(locale + ': unknown Directory ID ' + id);
    if (copy.has(id)) throw new Error(locale + ': duplicate Directory ID ' + id);
    copy.set(id, { title: title.trim(), problem: problem.trim() });
  }
  const missing = [...ids].filter(id => !copy.has(id));
  if (missing.length) throw new Error(locale + ': missing Directory translations for ' + missing.join(', '));
  return copy;
}

export function readDirectoryCopy(locale, records) {
  const translation = new URL('./directory-locales/' + locale + '.json', import.meta.url);
  return validateDirectoryCopy(locale, records, JSON.parse(readFileSync(translation, 'utf8')));
}
