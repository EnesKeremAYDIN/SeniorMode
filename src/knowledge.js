import initializeSQLite from '@sqlite.org/sqlite-wasm';
import { categories, readPatterns } from './patterns.js';

const sqlite = await initializeSQLite();

function normalized(text) {
  return text.normalize('NFKD').toLowerCase().replace(/\p{M}/gu, '').replaceAll('ı', 'i');
}

function terms(text) {
  return normalized(text).match(/[\p{L}\p{N}]+/gu) ?? [];
}

const stopWords = new Set(terms('a an and app as at be bir build bu by can code do for from how i in into is it make my of on or our project should so that the their this to use we what when which with you your ve yapmak için nasıl olan yap'));

function tokensFor(query) {
  return [...new Set(terms(query).filter(word => word.length > 1 && !stopWords.has(word)))].slice(0, 24);
}

function metadataFor(record) {
  const phrases = [record.title, ...record.aliases].map(value => terms(value));
  return {
    tokens: new Set(phrases.flat().concat(terms(record.summary))),
    phrases: phrases.filter(phrase => phrase.filter(word => word.length > 1 && !stopWords.has(word)).length >= 2)
      .map(phrase => ` ${phrase.join(' ')} `),
  };
}

function rankMatches(rows, metadata, query, tokens, limit) {
  const phrase = ` ${terms(query).join(' ')} `;
  const candidates = rows.map(row => {
    const { tokens: known, phrases } = metadata.get(row.id);
    const coverage = tokens.filter(token => known.has(token)).length;
    const matchedPhrase = phrases.some(value => phrase.includes(value));
    return { ...row, coverage, matchedPhrase };
  });
  // A full title or alias is stronger evidence than an isolated word in a record body.
  // Keep broad discovery when the query has no recognised phrase.
  if (!candidates.some(row => row.matchedPhrase)) return candidates.slice(0, limit);
  return candidates.filter(row => row.matchedPhrase || row.coverage >= 2)
    .sort((a, b) => Number(b.matchedPhrase) - Number(a.matchedPhrase) || a.score - b.score || a.id.localeCompare(b.id, 'en'))
    .slice(0, limit);
}

function compact(record) {
  return { id: record.id, title: record.title, category: record.category, summary: record.summary, path: record.path };
}

export function createKnowledge(records = readPatterns()) {
  const byId = new Map(records.map(record => [record.id, record]));
  const metadata = new Map(records.map(record => [record.id, metadataFor(record)]));
  const database = new sqlite.oo1.DB(':memory:', 'c');
  try {
    database.exec(`
      CREATE VIRTUAL TABLE search_index USING fts5(
        id UNINDEXED, category UNINDEXED, title, aliases, summary, body,
        tokenize = 'unicode61 remove_diacritics 2'
      );
    `);
    const insert = database.prepare('INSERT INTO search_index VALUES (?, ?, ?, ?, ?, ?)');
    try {
      database.transaction(() => {
        for (const r of records) {
          insert.bind([r.id, r.category, normalized(r.title), normalized(r.aliases.join(' ')),
            normalized(r.summary), normalized(r.body + '\n' +
              r.decisions.map(choice => `${choice.when} ${choice.use}`).join(' '))]).stepReset();
        }
      });
    } finally {
      insert.finalize();
    }
    const ranked = `
      SELECT id, bm25(search_index, 0, 0, 12, 9, 4, 0.7) AS score FROM search_index
      WHERE search_index MATCH ?1 AND (?2 IS NULL OR category = ?2)
      ORDER BY score, id LIMIT ?3
    `;
    const stop = category => {
      if (category !== undefined && !categories.includes(category)) throw new Error(`Unknown category: ${category}`);
    };
    return {
      get(id) {
        const record = byId.get(id);
        if (!record) throw new Error(`Unknown pattern: ${id}`);
        return record;
      },
      list(category) {
        stop(category);
        return records.filter(record => !category || record.category === category).map(compact);
      },
      search(query, { limit = 5, category } = {}) {
        stop(category);
        if (typeof query !== 'string' || query.length > 512) throw new Error('The query must be at most 512 characters.');
        if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error('Limit must be an integer from 1 to 20.');
        const tokens = tokensFor(query);
        if (!tokens.length) return [];
        const match = tokens.map(token => `"${token}"${token.length >= 5 ? '*' : ''}`).join(' OR ');
        const results = database.exec({ sql: ranked, bind: [match, category ?? null, Math.max(24, limit * 4)],
          rowMode: 'object', returnValue: 'resultRows' });
        return rankMatches(results, metadata, query, tokens, limit).map(result => compact(byId.get(result.id)));
      },
      close() {
        database.close();
      },
    };
  } catch (error) {
    database.close();
    throw error;
  }
}
