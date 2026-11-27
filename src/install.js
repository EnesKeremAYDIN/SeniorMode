import { createHash } from 'node:crypto';
import {
  cpSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync,
  renameSync, rmdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { skillRoot } from './patterns.js';
import { version } from './version.js';

export const agents = Object.freeze({
  codex: '.agents',
  'claude-code': '.claude',
  cursor: '.agents',
  'gemini-cli': '.gemini',
  opencode: '.agents',
});

const manifestName = '.seniormode-install.json';

function stat(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}

function contained(root, path) {
  const rel = relative(root, path);
  if (!rel || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
    throw new Error(`Path must be inside the selected project: ${path}`);
  }
}

function directory(path, create) {
  if (create && !stat(path)) {
    try {
      mkdirSync(path);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  const info = stat(path);
  if (info && (info.isSymbolicLink() || !info.isDirectory())) {
    throw new Error(`Expected a real directory: ${path}`);
  }
  return Boolean(info);
}

function location(project, agent, create = false) {
  if (!Object.hasOwn(agents, agent)) throw new Error(`Unknown agent: ${agent}`);
  const root = realpathSync(resolve(project));
  if (!lstatSync(root).isDirectory()) throw new Error('Project path must be an existing directory.');
  const agentFolder = join(root, agents[agent]);
  const parent = join(agentFolder, 'skills');
  if (directory(agentFolder, create)) directory(parent, create);
  const path = join(parent, 'seniormode');
  contained(root, path);
  return { root, parent, path };
}

function fingerprint(root) {
  const files = {};
  function visit(folder, prefix) {
    for (const file of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const name = prefix + file.name;
      const path = join(folder, file.name);
      if (file.isDirectory()) {
        files[name + '/'] = 'directory';
        visit(path, name + '/');
      } else if (!file.isFile()) {
        throw new Error(`Unsafe entry in skill directory: ${name}`);
      } else if (name !== manifestName) {
        files[name] = createHash('sha256').update(readFileSync(path)).digest('hex');
      }
    }
  }
  visit(root, '');
  return files;
}

function inspect(path) {
  const info = stat(path);
  if (!info) return { state: 'absent', path };
  if (!info.isDirectory() || info.isSymbolicLink()) return { state: 'unmanaged', path };
  const marker = join(path, manifestName);
  if (!stat(marker)?.isFile()) return { state: 'unmanaged', path };
  try {
    const manifest = JSON.parse(readFileSync(marker, 'utf8'));
    if (manifest.product !== 'seniormode' || typeof manifest.version !== 'string' ||
        !manifest.files || Array.isArray(manifest.files)) return { state: 'unmanaged', path };
    const actual = fingerprint(path);
    const clean = Object.keys(manifest.files).length === Object.keys(actual).length &&
      Object.entries(actual).every(([name, digest]) => manifest.files[name] === digest);
    return { state: clean ? 'installed' : 'modified', version: manifest.version, path };
  } catch {
    return { state: 'modified', path };
  }
}

export function skillStatus(project, agent) {
  return inspect(location(project, agent).path);
}

function withLock(parent, action) {
  const lock = join(parent, '.seniormode-install.lock');
  try {
    mkdirSync(lock);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`A SeniorMode install operation is locked at ${lock}`);
    throw error;
  }
  try {
    return action();
  } finally {
    rmdirSync(lock);
  }
}

function cleanTemporary(root, path) {
  contained(root, resolve(path));
  if (stat(path)) {
    contained(root, realpathSync(path));
    rmSync(path, { recursive: true, force: true, maxRetries: 2 });
  }
}

export function installSkill(project, agent, { update = false } = {}) {
  const { root, parent, path } = location(project, agent, !update);
  if (!directory(parent, false)) throw new Error('SeniorMode is absent. Use install to add it.');
  return withLock(parent, () => {
    const current = inspect(path);
    if (current.state === 'unmanaged' || current.state === 'modified') {
      throw new Error(`Refusing to replace an ${current.state} skill at ${path}`);
    }
    if (current.state === 'installed' && !update) return current;
    if (current.state === 'absent' && update) throw new Error('SeniorMode is absent. Use install to add it.');
    const scratch = mkdtempSync(join(parent, '.seniormode-stage-'));
    const staged = join(scratch, 'new');
    const backup = join(scratch, 'previous');
    let recoverable = true;
    try {
      cpSync(skillRoot, staged, { recursive: true, errorOnExist: true, force: false });
      const manifest = { product: 'seniormode', version, files: fingerprint(staged) };
      writeFileSync(join(staged, manifestName), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
      if (current.state === 'installed') renameSync(path, backup);
      try {
        renameSync(staged, path);
      } catch (error) {
        if (stat(backup)) {
          try {
            renameSync(backup, path);
          } catch (restoreError) {
            recoverable = false;
            throw new Error(`Could not restore the existing skill. Backup at ${backup}`, { cause: restoreError });
          }
        }
        throw error;
      }
      return inspect(path);
    } finally {
      if (recoverable) cleanTemporary(root, scratch);
    }
  });
}

export function uninstallSkill(project, agent) {
  const { root, parent, path } = location(project, agent);
  if (!stat(parent)) return inspect(path);
  return withLock(parent, () => {
    const current = inspect(path);
    if (current.state === 'absent') return current;
    if (current.state !== 'installed') {
      throw new Error(`Refusing to remove an ${current.state} skill at ${path}`);
    }
    const scratch = mkdtempSync(join(parent, '.seniormode-remove-'));
    try {
      renameSync(path, join(scratch, 'removed'));
    } finally {
      cleanTemporary(root, scratch);
    }
    return { state: 'absent', path };
  });
}
