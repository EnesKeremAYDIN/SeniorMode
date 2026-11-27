import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import { createKnowledge } from '../src/knowledge.js';

const suites = ['en', 'tr', 'natural', 'relevance'].flatMap(name =>
  JSON.parse(readFileSync(new URL('./queries-' + name + '.json', import.meta.url), 'utf8')));
const program = new Command().name('seniormode-benchmark');
program.option('--case <id...>', 'Run selected case IDs');
program.option('--json', 'Print retrieval results as JSON');
program.parse();

const { case: requested, json } = program.opts();
const selected = requested ? suites.filter(query => requested.includes(query.id)) : suites;
if (!selected.length || (requested && selected.length !== new Set(requested).size)) {
  throw new Error('One or more requested case IDs are unknown.');
}

const knowledge = createKnowledge();
try {
  const rows = selected.map(({ id, pattern: expected, query }) => {
    knowledge.get(expected);
    const hits = knowledge.search(query, { limit: 5 }).map(record => record.id);
    return { id, expected, rank: hits.indexOf(expected) + 1 || null, hits };
  });
  const report = {
    cases: rows.length,
    top1: rows.filter(row => row.rank === 1).length,
    top3: rows.filter(row => row.rank && row.rank <= 3).length,
    top5: rows.filter(row => row.rank).length,
    rows,
  };
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Retrieval: ${report.cases} cases, top 1 ${report.top1}, top 3 ${report.top3}, top 5 ${report.top5}`);
    for (const row of rows.filter(result => result.rank !== 1)) {
      console.log(`${row.id}: expected ${row.expected}, rank ${row.rank ?? 'missing'}; got ${row.hits.join(', ')}`);
    }
  }
  if (report.top3 !== report.cases) process.exitCode = 1;
} finally {
  knowledge.close();
}
