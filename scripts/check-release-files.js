import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const checkout = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--snapshot')) {
  throw new Error('Usage: node scripts/check-release-files.js [--snapshot <directory>]');
}
const root = args.length ? resolve(args[1]) : checkout;
if (!lstatSync(root).isDirectory()) throw new Error('Expected a real snapshot directory.');

function snapshotFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const path = join(folder, entry.name);
    return entry.isDirectory() && entry.name !== '.git'
      ? snapshotFiles(path)
      : [relative(root, path).replaceAll('\\', '/')];
  });
}

function gitPaths(options) {
  return execFileSync('git', ['ls-files', ...options, '-z'], {
    cwd: root, encoding: 'utf8',
  }).split('\0').filter(Boolean);
}

function candidateFiles() {
  const deleted = new Set(gitPaths(['--deleted']));
  return [...new Set(gitPaths(['--cached', '--others', '--exclude-standard']))].filter(path => !deleted.has(path));
}

const files = args.length ? snapshotFiles(root) : candidateFiles();

const contentChecks = [
  ['private key', /-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['API token', /\b(?:sk-proj-|sk-ant-)[A-Za-z0-9_-]{30,}\b/],
  ['cloud access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['personal filesystem path', /(?:[A-Z]:[\\/]+Users[\\/]+|\/Users\/|\/home\/)[A-Za-z0-9._-]+[\\/]/i],
];
const privatePath = /(?:^|\/)(?:\.git|\.codex|node_modules|\.env(?:\.(?!example(?:\/|$)|sample(?:\/|$))[^/]+)?|benchmarks\/runs)(?:\/|$)|\.(?:log|tgz|bundle|pem|p12)$/i;
const problems = [];
for (const file of files.sort()) {
  if (privatePath.test(file)) {
    problems.push([file, 'private or generated file']);
    continue;
  }
  const path = join(root, file);
  if (!lstatSync(path).isFile()) {
    problems.push([file, 'not a regular file']);
    continue;
  }
  const bytes = readFileSync(path);
  if (bytes.includes(0)) continue;
  const content = bytes.toString('utf8');
  for (const [label, pattern] of contentChecks) {
    if (pattern.test(content)) problems.push([file, label]);
  }
}
for (const [path, reason] of problems) console.error(reason + ': ' + path);
if (problems.length) process.exitCode = 1;
else console.log('Release file checks passed for ' + files.length + ' files. Review the candidate as part of the release procedure.');
