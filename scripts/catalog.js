import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, formatPatternDocument, knowledgeRoot, readPatterns, skillRoot } from '../src/patterns.js';

const records = readPatterns();
const catalog = join(skillRoot, 'references', 'catalog');
const repository = fileURLToPath(new URL('../', import.meta.url));
const names = {
  algorithms: 'Algorithms and data structures',
  architecture: 'Software architecture',
  backend: 'Backend and APIs',
  concurrency: 'Concurrency and coordination',
  data: 'Data and storage',
  frontend: 'Frontend engineering',
  geospatial: 'Geospatial engineering',
  networking: 'Networking and delivery',
  performance: 'Performance and capacity',
  product: 'Product behavior',
  reliability: 'Reliability and recovery',
  security: 'Defensive software security',
  testing: 'Testing and verification',
};

const lines = ['# Engineering decision records', '', 'Find a category, then open the record that matches the concrete problem.', ''];
const byCategory = [];
const recordDocuments = [];
const recordById = new Map(records.map(record => [record.id, record]));
for (const category of categories) {
  const entries = records.filter(record => record.category === category);
  if (entries.length === 0) throw new Error(`Empty category: ${category}`);
  lines.push(`- [${names[category]}](${category}.md) (${entries.length})`);
  const page = [`# ${names[category]}`, ''];
  for (const entry of entries) {
    page.push(`- [${entry.title}](../knowledge/${entry.path}) · ${entry.summary}`);
    const related = (entry.related ?? []).map(id => {
      const target = recordById.get(id);
      return `- [${target.title}](${posix.relative(category, target.path)})`;
    });
    const file = join(knowledgeRoot, entry.path);
    recordDocuments.push([file, formatPatternDocument(readFileSync(file, 'utf8'), entry, related)]);
  }
  byCategory.push([join(catalog, `${category}.md`), page.join('\n') + '\n']);
}

const outputs = [
  [join(catalog, 'index.md'), lines.join('\n') + '\n'],
  ...byCategory,
  ...recordDocuments,
  ...['LICENSE', 'LICENSE-CONTENT.md'].map(name => [join(skillRoot, name), readFileSync(join(repository, name), 'utf8')]),
];
const index = records.map(({ id, title, category, summary, aliases, path }) => ({ id, title, category, summary, aliases, path }));
outputs.push([join(catalog, 'index.json'), JSON.stringify(index, null, 2) + '\n']);
const check = process.argv[2] === '--check';
if (!check && process.argv[2] !== '--write') throw new Error('Use --write or --check.');
let stale = false;
for (const [file, content] of outputs) {
  if (check) {
    let previous = null;
    try { previous = readFileSync(file, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (previous !== content) {
      console.error(`Outdated generated file: ${file}`);
      stale = true;
    }
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}
if (check) {
  const expected = new Set(outputs.filter(([file]) => dirname(file) === catalog).map(([file]) => file));
  for (const file of readdirSync(catalog)) {
    if (!expected.has(join(catalog, file))) {
      console.error(`Unexpected generated file: ${file}`);
      stale = true;
    }
  }
}
if (stale) process.exitCode = 1;
else console.log(`${records.length} records in ${categories.length} categories. Catalog ${check ? 'verified' : 'generated'}.`);
