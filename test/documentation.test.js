import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { shuffleComparison } from '../examples/shuffle.mjs';
import { generatedDocuments, markdownTree, validateDocumentLinks } from '../scripts/documents.js';
import { validateDirectoryCopy } from '../scripts/document-directory.js';
import { localeMetadata, locales } from '../scripts/document-locales.js';
import { readmeAnchor, readmePath } from '../scripts/document-paths.js';
import { readmeSectionsByLocale } from '../scripts/document-sections.js';
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

test('all README pages include onboarding, examples, Directory and FAQ', () => {
  const slug = 'EnesKeremAYDIN/SeniorMode';
  const source = markdownTree(repository);
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
    assert.match(shuffle, /href="https:\/\/eneskeremaydin\.github\.io\/SeniorMode\/shuffle\/"[^\n]+play_circle\.svg/, locale);
    const rows = [...shuffle.matchAll(/^\| [^|]+\| ([^|]+) \| (\d+) \|$/gm)];
    assert.deepEqual(rows.map(([, order]) => order.replaceAll('**', '').split(' → ')), expectedOrders, locale);
    assert.deepEqual(rows.map(([, , count]) => Number(count)), [3, 1, 0], locale);
    const workflow = usage.slice(usage.indexOf('\n### ' + headings.how + '\n'));
    assert.deepEqual([...workflow.matchAll(/^(\d)\. \*\*/gm)].map(([, index]) => index), ['1', '2', '3', '4'], locale);
    const verification = workflow.match(/^4\. .+/m)?.[0];
    assert(verification?.includes('`200`') && /\*\*[^*]*\b1\b[^*]*\*\*/u.test(verification), locale);
    assert.match(workflow, /\]\(#example-payment-idempotency\)/, locale);
    assert.match(readme, /\*\*103\*\* .+ · \*\*13\*\* .+ · \*\*16\*\* .+ · \*\*5\*\* .+/, locale);
    for (const metric of ['stars', 'forks', 'v/release']) {
      assert(readme.includes('https://img.shields.io/github/' + metric + '/' + slug), locale);
    }
    assert.match(readme, /actions\/workflows\/ci\.yml\/badge\.svg/, locale);
    const commands = [...install.matchAll(/^npx skills@1\.9\.0 add EnesKeremAYDIN\/SeniorMode --skill seniormode --agent ([\w-]+) --copy -y\r?$/gm)];
    assert.deepEqual(commands.map(command => command[1]), Object.keys(agents), locale);
    const installLinks = [...install.matchAll(/<a href="#install-([\w-]+)">(.*?)<\/a>/g)];
    assert.deepEqual(installLinks.map(([, agent]) => agent), Object.keys(agents), locale);
    for (const [, agent, link] of installLinks) {
      assert.match(link, /assets\/docs-icons\/[^"]+\.svg"[^>]* alt=""/, locale + ' ' + agent);
      assert(install.includes('<a id="install-' + agent + '"></a>'), locale + ' ' + agent);
    }
    assert.match(install, /cursor-on-dark\.svg[^\n]+cursor-on-light\.svg/, locale);
    assert.match(install, /opencode-on-dark\.svg[^\n]+opencode-on-light\.svg/, locale);
    assert.match(install, /<summary>Codex<\/summary>\n\n(?:<div dir="ltr">\n\n)?```sh\nnpx skills@/, locale);
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
    const exampleLinks = [...examples.matchAll(/<a href="#example-([\w-]+)"><img [^>]+ alt="">&nbsp;[^<]+<\/a>/g)];
    assert.deepEqual(exampleLinks.map(([, id]) => id), exampleIds, locale);
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

test('all READMEs link to the shared contribution and accessibility guides', () => {
  const source = markdownTree(repository);
  const contribution = source.get('.github/CONTRIBUTING.md').replaceAll('\r\n', '\n');
  const accessibility = source.get('.github/ACCESSIBILITY.md');
  const languageSections = [...contribution.matchAll(/^<a id="([^"]+)"><\/a>\n\n## ([^\n]+)\n([\s\S]*?)(?=^<a id="[^"]+"><\/a>\n\n## |(?![\s\S]))/gm)];
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
    const contributionLink = readme.split(`<a href="${prefix}.github/CONTRIBUTING.md#${id}">`)[1]?.split('</a>')[0];
    assert(contributionLink?.endsWith('&nbsp;' + nav.contribute), locale);
    assert.match(contributionLink, /fork_right\.svg/, locale);
    assert.doesNotMatch(readme, /scripts\/directory-locales\/|id="contributing"/, locale);
    const docs = readme.split('\n## ' + headings.docs + '\n')[1].split('\n## ')[0];
    assert(docs.includes(`<a href="${prefix}.github/ACCESSIBILITY.md">${readmeSectionsByLocale[locale].accessibility}</a>`), locale);
    assert(contribution.includes(`[${language}](#${id})`), locale);
    assert.match(section, /scripts\/directory-locales\//, locale);
    assert.match(section, /npm run docs:generate/, locale);
    assert.match(section, /npm run verify/, locale);
    assert.match(section, /\]\(ACCESSIBILITY\.md\)/, locale);
    if (locale !== 'en') assert.match(section, /\]\(#en\)/, locale);
  }
});

test('the inline language menu links to every other README and a localized translation contribution section', () => {
  const docs = generatedDocuments();
  const languages = Object.keys(locales);
  const guide = docs.get('.github/CONTRIBUTING.md');
  for (const locale of languages) {
    const path = readmePath(locale);
    const readme = docs.get(path);
    const [, menu] = readme.match(/<p dir="ltr">(.+)<\/p>/);
    const items = [...menu.matchAll(/<(a|strong)(?: href="([^"]+)")? lang="([^"]+)" dir="(ltr|rtl)">([^<>]+)<\/\1>/g)]
      .map(([, type, href, tag, direction, label]) => [type, href, tag, direction, label.replaceAll('&nbsp;', ' ')]);
    const add = items.pop();
    assert.deepEqual(items.map(([, , tag]) => tag), languages, path);
    for (const [type, href, tag, direction, label] of items) {
      const current = tag === locale;
      const expectedHref = current ? undefined : posix.relative(posix.dirname(path), readmePath(tag));
      assert.deepEqual([type, href, direction, label], [current ? 'strong' : 'a', expectedHref,
        localeMetadata(tag).direction ?? 'ltr', locales[tag].language], path);
    }
    const fragment = 'add-a-language' + (locale === 'en' ? '' : '-' + locale.toLowerCase());
    const contribution = posix.relative(posix.dirname(path), '.github/CONTRIBUTING.md');
    assert.deepEqual(add, ['a', contribution + '#' + fragment, locale,
      localeMetadata(locale).direction ?? 'ltr', '+ ' + localeMetadata(locale).addLanguage], path);
    if (locale !== 'en') assert(guide.includes('<a id="' + fragment + '"></a>'), path);
  }
  assert.match(guide, /### Add your language\n\n/);
  assert.match(guide, /issues\/new\?template=translation\.yml/);
});

test('right-to-left READMEs keep shell commands and JSON in left-to-right blocks', () => {
  const docs = generatedDocuments();
  for (const locale of ['ar', 'fa', 'ug']) {
    const readme = docs.get(readmePath(locale));
    assert(readme.includes('<div lang="' + locale + '" dir="rtl">'), locale);
    const fences = [...readme.matchAll(/^```(?:sh|json)\n[\s\S]*?^```$/gm)];
    assert(fences.length > 0, locale);
    for (const block of fences) {
      assert(readme.slice(0, block.index).endsWith('<div dir="ltr">\n\n'), locale);
      assert(readme.slice(block.index + block[0].length).startsWith('\n\n</div>'), locale);
    }
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
    }
    const categoryLinks = [...directory.matchAll(/<a href="#category-([\w-]+)"><img src="[^"]+\/material\/([^"]+)"[^>]+ alt="">&nbsp;([^<]+)<\/a>/g)];
    assert.deepEqual(categoryLinks.map(([, category, , label]) => [category, label]),
      groups.map(([, category, label, count]) => [category, label.replaceAll('&', '&amp;') + ' (' + count + ')']), path);
    assert.equal(new Set(categoryLinks.map(([, , icon]) => icon)).size, categories.length, path);
    const links = [...directory.matchAll(patternLink)].map(([, , path]) => path);
    assert.deepEqual(links.sort(), records.map(({ path }) => path).sort(), path);
    assert.match(directory, /href="#engineering-standards"><img [^>]*fact_check\.svg[^>]*>[^<]+\(16\)<\/a>/, path);
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

test('all README pages share dynamic social assets and a single contributor link', () => {
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
