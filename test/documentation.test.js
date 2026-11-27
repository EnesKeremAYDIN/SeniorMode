import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { shuffleComparison } from '../examples/shuffle.mjs';
import { generatedDocuments, markdownTree, validateDocumentLinks } from '../scripts/documents.js';
import { validateDirectoryCopy } from '../scripts/document-directory.js';
import { locales } from '../scripts/document-locales.js';
import { readmeAnchor, readmePath } from '../scripts/document-paths.js';
import { agents } from '../src/install.js';
import { categories, readPatterns, skillRoot } from '../src/patterns.js';

const repository = fileURLToPath(new URL('../', import.meta.url));

test('Markdown and HTML documentation links and anchors resolve inside the repository', () => {
  validateDocumentLinks(markdownTree(repository), repository);
  assert(!readdirSync(join(repository, 'assets')).some(name => /^(?:shuffle|workflow)-demo.*\.gif$/.test(name)));
  const preview = readFileSync(join(repository, 'assets', 'brand', 'social-preview.png'));
  assert.equal(preview.subarray(1, 4).toString('ascii'), 'PNG');
  assert.deepEqual([preview.readUInt32BE(16), preview.readUInt32BE(20)], [1280, 640]);
  assert(preview.length < 1_000_000);
});

test('documentation link validation checks HTML anchors and each responsive image', t => {
  const fixture = mkdtempSync(join(tmpdir(), 'seniormode-doc-links-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  writeFileSync(join(fixture, 'guide.md'), '## Local heading\n<a id="explicit"></a>\n~~~md\n## Ignored\n~~~');
  writeFileSync(join(fixture, 'light.svg'), '');
  const validate = text => validateDocumentLinks(new Map([['guide.md', text]]), fixture);
  assert.doesNotThrow(() => validate('[Markdown](guide.md#local-heading) <a href=\'guide.md#explicit\'>HTML</a>\n'
    + '<source srcset="light.svg 1x">\n~~~md\n[example](missing.md)\n~~~'));
  assert.throws(() => validate('[Markdown](guide.md#ignored)'), /missing anchor/);
  assert.throws(() => validate('<a href="guide.md#missing">HTML</a>'), /missing anchor/);
  assert.throws(() => validate('<source srcset="light.svg 1x, missing.svg 2x">'), /broken link/);
});

test('all eight README pages include onboarding, examples, Directory and FAQ', () => {
  const slug = 'EnesKeremAYDIN/SeniorMode';
  const source = markdownTree(repository);
  assert.equal(Object.keys(locales).length, 8);
  const { randomComparator, uniform, varied } = shuffleComparison();
  const expectedOrders = [randomComparator, uniform, varied].map(queue => queue.map(track => track.artist));
  for (const [locale, { headings, nav, cases }] of Object.entries(locales)) {
    const readme = source.get(readmePath(locale)).replaceAll('\r\n', '\n');
    const sections = [headings.install, headings.use, nav.examples, nav.directory, nav.faq, headings.docs,
      headings.roadmap, headings.security, headings.contributors];
    const offsets = sections.map(title => readme.indexOf('\n## ' + title + '\n'));
    assert(offsets.every((offset, index) => offset > (offsets[index - 1] ?? 0)), locale);
    for (const section of ['install', 'usage', 'examples', 'directory', 'faq']) {
      assert(readme.slice(0, offsets[0]).includes('href="' + readmeAnchor(locale, section) + '"'), locale + ' ' + section);
    }
    const [install, usage, examples, , faq] = offsets.slice(0, -1).map((offset, index) => readme.slice(offset, offsets[index + 1]));
    const security = readme.slice(offsets.at(-2), offsets.at(-1));
    assert.match(security, /\.github\/SECURITY\.md/, locale);
    assert.match(readme, new RegExp('https://github.com/' + slug), locale);
    assert.doesNotMatch(readme, /(?:shuffle|workflow)-demo[^\s)]*\.gif/, locale);
    const shuffle = readme.slice(readme.indexOf('\n## ' + headings.shuffle + '\n'), offsets[0]);
    const rows = [...shuffle.matchAll(/^\| [^|]+\| ([^|]+) \| (\d+) \|$/gm)];
    assert.deepEqual(rows.map(([, order]) => order.replaceAll('**', '').split(' → ')), expectedOrders, locale);
    assert.deepEqual(rows.map(([, , count]) => Number(count)), [3, 1, 0], locale);
    const workflow = usage.slice(usage.indexOf('\n### ' + headings.how + '\n'));
    assert.deepEqual([...workflow.matchAll(/^(\d)\. \*\*/gm)].map(([, index]) => index), ['1', '2', '3', '4'], locale);
    assert.match(workflow, /`200`.*\*\*1/u, locale);
    assert.match(workflow, /\]\(#example-payment-idempotency\)/, locale);
    assert.match(readme, /\*\*103\*\* .+ · \*\*13\*\* .+ · \*\*16\*\* .+ · \*\*5\*\* .+/, locale);
    for (const metric of ['stars', 'forks', 'v/release']) {
      assert(readme.includes('https://img.shields.io/github/' + metric + '/' + slug), locale);
    }
    assert.match(readme, /actions\/workflows\/ci\.yml\/badge\.svg/, locale);
    const commands = [...install.matchAll(/^npx skills@1\.9\.0 add EnesKeremAYDIN\/SeniorMode --skill seniormode --agent ([\w-]+) --copy -y\r?$/gm)];
    assert.deepEqual(commands.map(command => command[1]), Object.keys(agents), locale);
    assert.match(install, /<summary>Codex<\/summary>\n\n```sh\nnpx skills@/, locale);
    assert.match(install, /npx skills@1\.9\.0 update seniormode --project/, locale);
    assert.match(install, /node bin\/seniormode\.js uninstall --agent codex/, locale);
    for (const name of ['search_patterns','get_pattern','compare_approaches','get_checklist','list_standards','get_standard','get_workflow']) {
      assert(install.includes('| `' + name + '` |'), locale + ' ' + name);
    }
    for (const config of ['codex mcp add', 'claude mcp add', '.cursor/mcp.json', '.gemini/settings.json', 'https://opencode.ai/config.json']) {
      assert(install.includes(config), locale + ' ' + config);
    }
    assert.match(install, /\| Cursor \| `.agents\/skills` \| `.agents\/skills` \|/, locale);
    const exampleIds = [...examples.matchAll(/<a id="example-([\w-]+)"><\/a>/g)].map(([, id]) => id);
    assert.deepEqual(exampleIds, ['music-shuffle', 'reservation-concurrency', 'payment-idempotency', 'cursor-pagination'], locale);
    for (const file of ['shuffle','reservation','payment-retry','pagination']) {
      assert(examples.includes('node --test test/' + file + '.test.js'), locale + ' ' + file);
    }
    for (const [title] of cases) assert(examples.includes('\n### ' + title + '\n'), locale);
    assert.equal([...faq.matchAll(/^### /gm)].length, 6, locale);
  }
  const localizedPages = [...source.keys()].filter(path => path.startsWith('docs/i18n/'));
  const expected = Object.keys(locales).filter(locale => locale !== 'en').map(readmePath);
  assert.deepEqual(localizedPages.sort(), expected.sort());
  assert(![...source.keys()].some(path => path.startsWith('docs/patterns/')));
});

test('all eight READMEs link to the shared contribution and accessibility guides', () => {
  const source = markdownTree(repository);
  const contribution = source.get('.github/CONTRIBUTING.md').replaceAll('\r\n', '\n');
  const accessibility = source.get('.github/ACCESSIBILITY.md');
  const labels = ['Accessibility', 'Erişilebilirlik', 'Barrierefreiheit', 'Accesibilidad', 'Accessibilité',
    'アクセシビリティ', 'Acessibilidade', '无障碍'];
  const languageSections = [...contribution.matchAll(/^<a id="([^"]+)"><\/a>\n\n## ([^\n]+)\n([\s\S]*?)(?=^<a id=|(?![\s\S]))/gm)];
  assert.deepEqual(languageSections.map(([, id, language]) => [id, language]),
    Object.entries(locales).map(([locale, { language }]) => [locale.toLowerCase(), language]));
  assert.match(languageSections[0][3], /\]\(\.\.\/schema\/pattern\.schema\.json\)/);
  assert.match(languageSections[0][3], /scripts\/document-contribution\.js/);
  assert.match(accessibility, /keyboard.*screen reader/);
  assert.match(accessibility, /issues\/new\?template=bug\.yml/);
  for (const [index, [locale, { nav, headings }]] of Object.entries(locales).entries()) {
    const [, id, language, section] = languageSections[index];
    const readme = source.get(readmePath(locale)).replaceAll('\r\n', '\n');
    const prefix = locale === 'en' ? '' : '../../../';
    assert(readme.includes(`<a href="${prefix}.github/CONTRIBUTING.md#${id}">${nav.contribute}</a>`), locale);
    assert.doesNotMatch(readme, /scripts\/directory-locales\/|id="contributing"/, locale);
    const docs = readme.split('\n## ' + headings.docs + '\n')[1].split('\n## ')[0];
    assert(docs.includes(`[${labels[index]}](${prefix}.github/ACCESSIBILITY.md)`), locale);
    assert(contribution.includes(`[${language}](#${id})`), locale);
    assert.match(section, /scripts\/directory-locales\//, locale);
    assert.match(section, /npm run docs:generate/, locale);
    assert.match(section, /npm run verify/, locale);
    assert.match(section, /\]\(ACCESSIBILITY\.md\)/, locale);
    if (locale !== 'en') assert.match(section, /\]\(#en\)/, locale);
  }
});

test('all embedded Skill Directories match canonical record IDs, category counts, anchors, and standards', () => {
  const generated = generatedDocuments();
  const records = readPatterns();
  assert.equal(records.length, 103);
  assert.equal(categories.length, 13);
  const standards = readdirSync(join(skillRoot, 'references/standards')).filter(name => name.endsWith('.md')).sort();
  assert.equal(standards.length, 16);
  const categoryAnchor = /<a id="category-([\w-]+)"><\/a>\n\n<details>\n<summary>(.+) \((\d+)\)<\/summary>\n\n([\s\S]*?)\n\n<\/details>/g;
  const patternLink = /- \[([^\]\n]+)\]\([^\n)]*skills\/seniormode\/references\/knowledge\/([\w-]+\/[\w-]+\.md)\) — (\S[^\n]*)/g;
  for (const [locale, { nav }] of Object.entries(locales)) {
    const path = readmePath(locale);
    const readme = readFileSync(join(repository, path), 'utf8').replaceAll('\r\n', '\n');
    assert.equal(readme, generated.get(path));
    const directory = readme.slice(readme.indexOf('\n## ' + nav.directory + '\n'), readme.indexOf('\n## ' + nav.faq + '\n'));
    const groups = [...directory.matchAll(categoryAnchor)];
    assert.deepEqual(groups.map(([, id]) => id), categories, path);
    for (const [, category, label, count, content] of groups) {
      const expected = records.filter(record => record.category === category).map(({ path }) => path);
      const actual = [...content.matchAll(patternLink)].map(([, , path]) => path);
      assert.deepEqual(actual, expected, `${path} ${category}`);
      assert.equal(Number(count), actual.length, path);
      assert(directory.includes(`[${label} (${count})](#category-${category})`), path);
    }
    const links = [...directory.matchAll(patternLink)].map(([, , path]) => path);
    assert.deepEqual(links.sort(), records.map(({ path }) => path).sort(), path);
    assert.match(directory, /\(16\)\]\(#engineering-standards\)/, path);
    const [, guides] = directory.split('<a id="engineering-standards"></a>');
    assert.deepEqual([...guides.matchAll(/standards\/([\w-]+\.md)\)/g)].map(([, name]) => name).sort(), standards, path);
  }
});

test('a new Directory record cannot silently fall back to another language or overwrite a translation', () => {
  const records = [{ id: 'one' }, { id: 'two' }];
  const one = ['one', 'Bir', 'İlk soru'];
  const two = ['two', 'İki', 'İkinci soru'];
  assert.deepEqual(validateDirectoryCopy('tr', records, [two, one]).get('one'), { title: 'Bir', problem: 'İlk soru' });
  assert.throws(() => validateDirectoryCopy('tr', records, [one]), /tr: missing Directory translations for two/);
  assert.throws(() => validateDirectoryCopy('tr', records, [one, one]), /tr: duplicate Directory ID one/);
  assert.throws(() => validateDirectoryCopy('tr', records, [one, ['old', 'Titre', 'Problème']]), /tr: unknown Directory ID old/);
  assert.throws(() => validateDirectoryCopy('tr', records, [one, ['two', 'İki', ' ']]), /title and problem/);
});

test('all eight README pages share dynamic social assets and a single contributor link', () => {
  const files = new Map([...generatedDocuments()].filter(([path]) => path.endsWith('README.md')));
  assert.deepEqual([...files.keys()], Object.keys(locales).map(readmePath));
  for (const [path, content] of files) {
    const image = 'https://contrib.rocks/image?repo=EnesKeremAYDIN/SeniorMode';
    const link = 'https://github.com/EnesKeremAYDIN/SeniorMode/graphs/contributors';
    assert.equal(content.split(image).length, 2, path);
    assert.equal(content.split(link).length, 2, path);
    assert.match(content, /prefers-color-scheme: dark\)" srcset="https:\/\/api\.star-history\.com\/svg\?[^"]+&amp;theme=dark"/, path);
    assert.match(content, /prefers-color-scheme: light\)" srcset="https:\/\/api\.star-history\.com\/svg\?[^"]+"/, path);
    assert.doesNotMatch(content, /(?:[?&](?:token|api[_-]?key)=|dated snapshot|Verified GitHub snapshot|when you have access)/i, path);
  }
});
