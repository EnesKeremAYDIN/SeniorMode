import { execFile, execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { Command, InvalidArgumentError } from 'commander';
import { installSkill } from '../src/install.js';
import { discoveryCases, nativeCases } from './native-cases.js';
import { benchmarkMcpOverrides } from './native-mcp.js';
import { readAgentTrace } from './native-trace.js';

const benchmarkDir = dirname(fileURLToPath(import.meta.url));
const codex = process.platform === 'win32' ? 'codex.exe' : 'codex';
const origins = { ollama: 'http://127.0.0.1:11434', lmstudio: 'http://127.0.0.1:1234' };
const startManifest = '{ "private": true, "type": "module", "scripts": { "test": "node --test" } }\n';
const maxProcessOutput = 4 * 1024 * 1024;

function command(program, args, options = {}) {
  return execFileSync(program, args, { encoding: 'utf8', timeout: 8_000, stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
}

function tryCommand(program, args) {
  try { return command(program, args); } catch { return null; }
}

function dockerEndpoint() {
  const activeHost = process.env.DOCKER_HOST || tryCommand('docker', ['context', 'inspect', '--format', '{{.Endpoints.docker.Host}}']);
  return /^(?:npipe:\/\/\/|unix:\/\/\/)/.test(activeHost ?? '') ? activeHost : null;
}

async function localModels(provider) {
  const suffix = provider === 'ollama' ? '/api/tags' : '/v1/models';
  try {
    const response = await fetch(origins[provider] + suffix, { redirect: 'error', signal: AbortSignal.timeout(1_500) });
    if (!response.ok) return null;
    const data = await response.json();
    const entries = provider === 'ollama' ? data.models?.map(model => model.name) : data.data?.map(model => model.id);
    return Array.isArray(entries) ? entries.filter(item => typeof item === 'string') : null;
  } catch {
    return null;
  }
}

function existingInstallation() {
  const bases = [join(homedir(), '.agents'), join(homedir(), '.codex')];
  if (process.env.CODEX_HOME) bases.push(process.env.CODEX_HOME);
  return bases.some(base => {
    try {
      return readdirSync(join(base, 'skills'), { withFileTypes: true }).some(entry => {
        if (!entry.isDirectory() && !entry.isSymbolicLink()) return false;
        try {
          return /^name:\s*["']?seniormode["']?\s*$/im.test(readFileSync(join(base, 'skills', entry.name, 'SKILL.md'), 'utf8'));
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  });
}

async function inspect(provider, image) {
  const endpoint = dockerEndpoint();
  const docker = endpoint ? tryCommand('docker', ['info', '--format', '{{.ServerVersion}}']) : null;
  const probes = Object.keys(origins).filter(name => !provider || provider === name);
  return {
    codex: tryCommand(codex, ['--version']),
    localDocker: docker,
    graderImage: image && docker ? tryCommand('docker', ['image', 'inspect', '--format', '{{.Id}}', image]) : null,
    globalSeniorModeDetected: existingInstallation(),
    providers: Object.fromEntries(await Promise.all(probes.map(async name => [name, await localModels(name)]))),
  };
}

function runGraderContainer(image, flags, nodeArguments, input = '') {
  const name = 'seniormode-benchmark-' + randomUUID();
  const limits = [
    'run', '--rm', '-i', '--name', name, '--pull', 'never', '--network', 'none', '--read-only', '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges', '--user', '65534:65534', '--pids-limit', '64', '--memory', '384m', '--cpus', '1',
    '--tmpfs', '/tmp:rw,noexec,nosuid,nodev,size=32m',
  ];
  try {
    return command('docker', [...limits, ...flags, '--entrypoint', 'node', image, ...nodeArguments], {
      timeout: 45_000, maxBuffer: maxProcessOutput, input, stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (error) {
    tryCommand('docker', ['rm', '--force', name]);
    throw error;
  }
}

function writeProject(folder, files) {
  for (const [name, data] of Object.entries(files)) {
    const target = join(folder, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
  }
}

function projectSnapshot(root) {
  const files = Object.create(null);
  let bytes = 0;
  function visit(folder, prefix = '') {
    for (const item of readdirSync(folder, { withFileTypes: true })) {
      const path = prefix + item.name;
      if (path === '.agents/skills/seniormode') continue;
      const local = join(folder, item.name);
      const metadata = lstatSync(local);
      if (metadata.isDirectory()) visit(local, path + '/');
      else if (metadata.isFile() && metadata.nlink === 1) {
        bytes += metadata.size;
        if (Object.keys(files).length >= 128 || bytes > 1024 * 1024) throw new Error('Generated workspace exceeds snapshot limits.');
        files[path] = readFileSync(local);
      } else {
        throw new Error('Generated workspace contains an unsupported or linked file.');
      }
    }
  }
  visit(root);
  return files;
}

function projectSignals(before, after) {
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const same = name => before[name]?.equals(after[name] ?? Buffer.alloc(0)) && after[name] !== undefined;
  const changedPaths = names.filter(name => !same(name));
  const dependencyFields = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
  function dependencies(files) {
    const json = JSON.parse(files['package.json']?.toString() ?? '{}');
    return JSON.stringify(dependencyFields.map(key => Object.entries(json[key] ?? {}).sort()));
  }
  const lines = files => Object.entries(files).filter(([name]) => /^(?:src\/|lib\/).+\.[cm]?[jt]s$/.test(name))
    .reduce((count, [, contents]) => count + contents.toString().split(/\r?\n/).filter(line => line.trim()).length, 0);
  return {
    workspaceUnchanged: changedPaths.length === 0,
    changedPaths,
    extraSourceFiles: names.filter(name => /^(?:src\/|lib\/).+\.[cm]?[jt]s$/.test(name) && !before[name] && after[name]),
    sourceLineDelta: lines(after) - lines(before),
    dependencyChanges: dependencies(before) !== dependencies(after),
    policyUnchanged: Boolean(same('src/currency.mjs')),
  };
}

function agentRun(workspace, scenario, options, integration) {
  const origin = origins[options.provider];
  const port = options.provider === 'ollama' ? '11434' : '1234';
  const safeEnvironment = { ...process.env };
  for (const name of Object.keys(safeEnvironment)) {
    if (/(?:_KEY$|TOKEN|PASSWORD|SECRET|_PROXY|^GITHUB_|^AWS_|^AZURE_|^GOOGLE_APPLICATION_CREDENTIALS$)/i.test(name)) {
      delete safeEnvironment[name];
    }
  }
  const args = [
    'exec', '--ignore-user-config', '--ignore-rules', '--skip-git-repo-check', '--ephemeral', '--oss',
    '--local-provider', options.provider, '--model', options.model, '--json', '--color', 'never',
    '--sandbox', scenario.mode === 'build' ? 'workspace-write' : 'read-only',
    '-c', 'approval_policy="never"', '-c', 'sandbox_workspace_write.network_access=false',
    '-c', 'sandbox_workspace_write.exclude_tmpdir_env_var=true', '-c', 'sandbox_workspace_write.exclude_slash_tmp=true',
    ...(integration === 'mcp' ? benchmarkMcpOverrides() : []),
    '-',
  ];
  const start = performance.now();
  return new Promise(resolve => {
    const task = execFile(codex, args, {
      cwd: workspace, timeout: 180_000, maxBuffer: maxProcessOutput, encoding: 'utf8',
      env: { ...safeEnvironment, OLLAMA_HOST: origin, LMSTUDIO_BASE_URL: origin + '/v1',
        CODEX_OSS_BASE_URL: origin + '/v1', NO_PROXY: '127.0.0.1:' + port },
    }, (error, stdout, stderr) => {
      const parsed = readAgentTrace(stdout ?? '', scenario.records ?? scenario.record);
      resolve({
        ...parsed,
        milliseconds: Math.round(performance.now() - start),
        providerLimited: parsed.providerLimited || /429 Too Many Requests|rate limit|at capacity/i.test(stderr ?? ''),
        failed: Boolean(error) || !parsed.answer || !parsed.turnCompleted,
        failure: error ? (error.killed ? 'Agent timed out' : 'Agent process failed') : null,
      });
    });
    task.stdin.on('error', () => {});
    task.stdin.end(scenario.prompt, 'utf8');
  });
}

function gradeInDocker(caseId, folder, image, metadata) {
  const mount = (source, destination) => 'type=bind,source=' + source + ',target=' + destination + ',readonly';
  const grader = join(benchmarkDir, 'native-grade.js');
  const cases = join(benchmarkDir, 'native-cases.js');
  const mounts = [
    '--mount', mount(folder, '/project'), '--mount', mount(grader, '/grade/native-grade.js'),
    '--mount', mount(cases, '/grade/native-cases.js'), '--workdir', '/project',
  ];
  const stdout = runGraderContainer(image, mounts, ['/grade/native-grade.js', caseId, '/project'], JSON.stringify(metadata));
  const markers = stdout.split(/\r?\n/).filter(line => line.startsWith('SENIORMODE_GRADE_JSON '));
  if (markers.length !== 1) throw new Error('The grading container did not return one result.');
  const result = JSON.parse(markers[0].slice('SENIORMODE_GRADE_JSON '.length));
  const expected = nativeCases.find(item => item.id === caseId).checks;
  for (const [group, names] of Object.entries(expected)) {
    if (JSON.stringify(names) !== JSON.stringify(result[group]?.map(check => check.name))
        || result[group].some(check => typeof check.passed !== 'boolean')) throw new Error('Incomplete grading result.');
  }
  return result;
}

async function runTrial(root, scenario, arm, repeat, options) {
  const discovery = scenario.mode === 'discovery';
  const integration = arm === 'seniormode' ? options.integration : 'none';
  const identity = { case: scenario.id, track: discovery ? 'discovery' : 'implementation', arm, repeat, integration,
    expectedRecords: scenario.records ?? [scenario.record],
    manualReview: { engineeringDecision: null, architectureQuality: null, unnecessaryComplexity: null, explanationQuality: null } };
  if (discovery) identity.manualReview.discovery = scenario.rubric.map(criterion => ({ criterion, score: null }));
  let folder;
  let before;
  try {
    folder = mkdtempSync(join(root, 'trial-'));
    writeProject(folder, { 'package.json': startManifest, ...scenario.files });
    before = projectSnapshot(folder);
    if (integration === 'skill') installSkill(folder, 'codex');
  } catch (error) {
    return { ...identity, status: 'incomplete-setup', setupError: error.message.slice(0, 300) };
  }
  const agent = await agentRun(folder, scenario, options, integration);
  const result = { ...identity, ...agent };
  if (agent.failed || agent.providerLimited) return { ...result, status: 'incomplete-agent' };
  if (arm === 'baseline' && (agent.evidence.skillOpened || agent.evidence.recordsOpened.length || agent.evidence.mcpUsed)) {
    return { ...result, status: 'contaminated-baseline' };
  }
  try {
    const after = projectSnapshot(folder);
    const signals = projectSignals(before, after);
    if (discovery) {
      return { ...result, signals, status: signals.workspaceUnchanged ? 'completed' : 'modified-read-only-fixture' };
    }
    const candidate = mkdtempSync(join(root, 'candidate-'));
    writeProject(candidate, after);
    const checks = gradeInDocker(scenario.id, candidate, options.graderId, { ...signals, answer: agent.answer });
    return {
      ...result, signals, checks, status: 'completed',
      changedFilesForReview: Object.fromEntries(signals.changedPaths
        .filter(path => path.startsWith('src/') && after[path]).map(path => [path, after[path].toString().slice(0, 8192)])),
    };
  } catch (error) {
    return { ...result, status: 'incomplete-grade', gradeError: error.message.slice(0, 300) };
  }
}

async function live(options, selected) {
  const implementation = selected.some(scenario => scenario.mode !== 'discovery');
  if (!options.provider || !options.model || (implementation && !options.graderImage)) {
    throw new Error('--live requires --provider and --model. Implementation also requires --grader-image.');
  }
  const environment = await inspect(options.provider, options.graderImage);
  if (!environment.codex || (implementation && !environment.graderImage) || !environment.providers[options.provider]?.includes(options.model)
      || environment.globalSeniorModeDetected) {
    console.log(JSON.stringify({ status: 'blocked', environment }, null, 2));
    process.exitCode = 1;
    return;
  }
  const graderVersion = implementation
    ? runGraderContainer(environment.graderImage, [],
      ['-e', 'if (+process.versions.node.split(".")[0] < 22) process.exit(1); require("node:sqlite"); console.log(process.version)'])
    : null;
  const parent = realpathSync(tmpdir());
  const root = mkdtempSync(join(parent, 'seniormode-native-'));
  const results = [];
  try {
    for (let repeat = 1; repeat <= options.repeat; repeat += 1) {
      const arms = repeat % 2 ? ['baseline', 'seniormode'] : ['seniormode', 'baseline'];
      for (const scenario of selected) {
        for (const arm of arms) {
          if (results.some(result => result.providerLimited)) {
            results.push({ case: scenario.id, repeat, arm, status: 'skipped-provider-limit' });
          } else results.push(await runTrial(root, scenario, arm, repeat, { ...options, graderId: environment.graderImage }));
          const result = results.at(-1);
          console.log([result.case, result.repeat, result.arm, result.status].join(' '));
        }
      }
    }
    const paired = selected.flatMap(scenario => Array.from({ length: options.repeat }, (_, index) => {
      const pair = results.filter(row => row.case === scenario.id && row.repeat === index + 1);
      const baseline = pair.find(row => row.arm === 'baseline');
      const seniorMode = pair.find(row => row.arm === 'seniormode');
      const complete = pair.length === 2 && pair.every(row => row.status === 'completed');
      const delta = (a, b) => Number.isFinite(a) && Number.isFinite(b) ? b - a : null;
      return {
        case: scenario.id, track: scenario.mode === 'discovery' ? 'discovery' : 'implementation', repeat: index + 1,
        statuses: Object.fromEntries(pair.map(row => [row.arm, row.status])),
        complete,
        differences: complete ? {
          inputTokens: delta(baseline.usage?.input_tokens, seniorMode.usage?.input_tokens),
          outputTokens: delta(baseline.usage?.output_tokens, seniorMode.usage?.output_tokens),
          agentMilliseconds: delta(baseline.milliseconds, seniorMode.milliseconds),
        } : null,
      };
    }));
    const runsRoot = join(benchmarkDir, 'runs');
    mkdirSync(runsRoot, { recursive: true });
    if (lstatSync(runsRoot).isSymbolicLink()) throw new Error('Expected a local results directory.');
    const output = join(runsRoot, 'native-agent-' + Date.now() + '.json');
    writeFileSync(output, JSON.stringify({ kind: 'native-local-paired', environment, graderVersion, model: options.model,
      provider: options.provider, integration: options.integration, repeat: options.repeat, paired, results }, null, 2) + '\n', { flag: 'wx' });
    console.log('Wrote ' + basename(output));
    if (results.some(result => result.status !== 'completed')) process.exitCode = 1;
  } finally {
    const rel = relative(parent, realpathSync(root));
    if (!rel.startsWith('seniormode-native-') || rel.includes(sep)) throw new Error('Unexpected benchmark workspace path.');
    rmSync(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

const cli = new Command().name('seniormode-agent-benchmark')
  .option('--probe', 'Detect existing local prerequisites without running a model')
  .option('--live', 'Run the paired benchmark against a local model')
  .addOption(new Command().createOption('--provider <provider>', 'Loopback provider').choices(Object.keys(origins)))
  .option('--model <id>', 'Explicit locally available model ID')
  .option('--grader-image <image>', 'Existing local Node 22+ Docker image')
  .addOption(new Command().createOption('--track <track>', 'Evaluation track').choices(['discovery', 'implementation', 'all']))
  .addOption(new Command().createOption('--integration <integration>', 'SeniorMode access for the treatment arm')
    .choices(['skill', 'mcp']).default('skill'))
  .option('--case <id...>', 'Select named fixtures')
  .option('--repeat <count>', 'Repeat each pair 1–5 times', value => {
    if (!/^[1-5]$/.test(value)) throw new InvalidArgumentError('Expected an integer from 1 to 5.');
    return Number(value);
  }, 1);
cli.parse();
const options = cli.opts();
if (options.probe && options.live) throw new Error('Choose --probe or --live.');
const available = !options.track && !options.case || options.track === 'implementation' ? nativeCases
  : options.track === 'discovery' ? discoveryCases : [...discoveryCases, ...nativeCases];
const selected = options.case ? available.filter(item => options.case.includes(item.id)) : available;
if (options.case && selected.length !== new Set(options.case).size) throw new Error('Unknown benchmark case.');
if (options.live) await live(options, selected);
else if (options.probe) console.log(JSON.stringify(await inspect(options.provider, options.graderImage), null, 2));
else console.log(JSON.stringify(selected.map(({ id, tags, mode, record, records, rubric }) =>
  ({ id, tags, mode, records: records ?? [record], rubric })), null, 2));
