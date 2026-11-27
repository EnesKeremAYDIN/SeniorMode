import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { skillRoot } from './patterns.js';

const workflows = {
  build: { title: 'Build a new project or improve an existing one', path: 'references/build.md' },
  audit: { title: 'Audit existing behavior', path: 'references/audit.md' },
  principles: { title: 'SeniorMode operating principles', path: 'SKILL.md' },
};

export const workflowIds = Object.freeze(Object.keys(workflows));

function read(path) {
  try {
    return readFileSync(join(skillRoot, path), 'utf8').trimEnd();
  } catch {
    throw new Error('The bundled guidance could not be read. Check the SeniorMode installation.');
  }
}

export function listStandards() {
  const entries = [];
  for (const line of read('references/standards.md').split(/\r?\n/)) {
    const columns = line.split('|');
    if (columns.length !== 4) continue;
    for (const [, title, id] of columns[2].matchAll(/\[([^\]]+)\]\(standards\/([a-z][a-z-]*)\.md\)/g)) {
      entries.push({ id, title, when: columns[1].trim(), path: 'references/standards/' + id + '.md' });
    }
  }
  return entries;
}

export function getStandard(id, standards = listStandards()) {
  const entry = standards.find(standard => standard.id === id);
  if (!entry) throw new Error('Unknown standard ID. Use list_standards for the available IDs.');
  return { ...entry, body: read(entry.path) };
}

export function getWorkflow(id) {
  if (!Object.hasOwn(workflows, id)) throw new Error('Unknown workflow ID. Use build, audit, or principles.');
  const entry = workflows[id];
  return { id, ...entry, body: read(entry.path) };
}
