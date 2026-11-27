import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import { parse } from 'yaml';

export const skillRoot = fileURLToPath(new URL('../skills/seniormode/', import.meta.url));
export const knowledgeRoot = join(skillRoot, 'references', 'knowledge');
const schema = JSON.parse(readFileSync(new URL('../schema/pattern.schema.json', import.meta.url), 'utf8'));
const validator = new Ajv({ allErrors: true }).compile(schema);
export const categories = Object.freeze([...schema.properties.category.enum]);
const requiredSections = ['Scenario', 'Failure modes', 'Explain it simply'];
const optionalSections = new Set([
  'When not to use',
  'Implementation guidance',
  'Architecture notes',
  'Worked example',
  'Edge cases',
  'Verification details',
]);
const titleMarker = '<!-- Generated record title. -->';
const detailsStart = '<!-- Generated record details. Edit the YAML above and run npm run catalog. -->';
const detailsEnd = '<!-- End generated record details. -->';
const generatedTitle = /^<!-- Generated record title\. -->\r?\n# [^\r\n]+\r?\n\r?\n/;
const generatedDetails = /\r?\n\r?\n<!-- Generated record details\. Edit the YAML above and run npm run catalog\. -->\r?\n[\s\S]*\r?\n<!-- End generated record details\. -->$/;

function bodyHeadings(body) {
  const headings = [];
  let fence;
  for (const match of body.matchAll(/^(?: {0,3}(\x60{3,}|~{3,})([^\r\n]*)|## ([^\r\n]+))\r?$/gm)) {
    const [, marker, suffix, heading] = match;
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length && !suffix.trim()) fence = undefined;
    } else if (!fence) {
      headings.push({ name: heading.trim(), index: match.index, length: match[0].length });
    }
  }
  return headings;
}

function splitPattern(raw, source) {
  const match = /^(---\r?\n([\s\S]+?)\r?\n---)\r?\n([\s\S]+)$/.exec(raw);
  if (!match) throw new Error(`${source}: missing YAML frontmatter or Markdown body`);
  const [, frontmatter, yaml, markdown] = match;
  return { frontmatter, yaml, markdown };
}

export function parsePattern(raw, source = 'pattern') {
  const { yaml, markdown } = splitPattern(raw, source);
  const metadata = parse(yaml, { maxAliasCount: 0 });
  if (!validator(metadata)) {
    const problems = validator.errors.map(error => `${error.instancePath || '/'} ${error.message}`);
    throw new Error(`${source}: ${problems.join('; ')}`);
  }
  const body = markdown.trim().replace(generatedTitle, '').replace(generatedDetails, '');
  const headings = bodyHeadings(body);
  const names = headings.map(heading => heading.name);
  if (names.slice(0, requiredSections.length).join('|') !== requiredSections.join('|')) {
    throw new Error(`${source}: expected these sections in order: ${requiredSections.join(', ')}`);
  }
  const optional = names.slice(requiredSections.length);
  if (optional.some(name => !optionalSections.has(name)) || new Set(optional).size !== optional.length) {
    throw new Error(`${source}: unexpected or duplicate optional section`);
  }
  for (let i = 0; i < headings.length; i += 1) {
    const start = headings[i].index + headings[i].length;
    const prose = body.slice(start, headings[i + 1]?.index).trim();
    if (prose.length < 30) throw new Error(`${source}: incomplete ${names[i]} section`);
  }
  return { ...metadata, body };
}

export function readPatterns(root = knowledgeRoot) {
  const records = [];
  const ids = new Set();
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (!entry.isDirectory() || !categories.includes(entry.name)) {
      throw new Error(`Unexpected entry in knowledge directory: ${entry.name}`);
    }
    const directory = join(root, entry.name);
    for (const file of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      if (!file.isFile() || !file.name.endsWith('.md')) throw new Error(`Unexpected knowledge file: ${file.name}`);
      const path = join(directory, file.name);
      const record = parsePattern(readFileSync(path, 'utf8'), path);
      if (record.id !== basename(path, '.md') || record.category !== basename(dirname(path))) {
        throw new Error(`${path}: ID and category must match the file path`);
      }
      if (ids.has(record.id)) throw new Error(`Duplicate pattern ID: ${record.id}`);
      ids.add(record.id);
      records.push({ ...record, path: relative(root, path).split(sep).join('/') });
    }
  }
  for (const record of records) {
    for (const id of record.related ?? []) {
      if (id === record.id || !ids.has(id)) throw new Error(`${record.id}: invalid related ID ${id}`);
    }
  }
  return records;
}

function detailSections(record) {
  const choices = record.decisions.map(choice => `- **${choice.when}** ${choice.use} ${choice.tradeoff}`);
  const checks = record.checks.map(check => `- ${check}`);
  const sources = record.sources.map(source => `- [${source.title}](${source.url})`);
  return [
    `## Decision rules\n\n${choices.join('\n')}`,
    `## Verification\n\n${checks.join('\n')}`,
    `## Sources\n\n${sources.join('\n')}`,
  ];
}

export function formatPatternDocument(raw, record, related) {
  const { frontmatter } = splitPattern(raw, record.id);
  const details = detailSections(record);
  if (related.length) details.push(`## Related decisions\n\n${related.join('\n')}`);
  const appendix = [detailsStart, ...details, detailsEnd].join('\n\n');
  return [frontmatter.replaceAll('\r\n', '\n'), titleMarker + '\n# ' + record.title,
    record.body.replaceAll('\r\n', '\n'), appendix].join('\n\n') + '\n';
}

export function formatPattern(record) {
  const [choices, checks, sources] = detailSections(record);
  const notesStart = bodyHeadings(record.body)[requiredSections.length]?.index;
  const overview = record.body.slice(0, notesStart).trimEnd();
  const notes = notesStart === undefined ? [] : [record.body.slice(notesStart)];
  return [
    `# ${record.title}\n\n${record.summary}`,
    overview,
    choices,
    checks,
    ...notes,
    sources,
  ].join('\n\n');
}
