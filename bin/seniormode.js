#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { agents, installSkill, skillStatus, uninstallSkill } from '../src/install.js';
import { categories, formatPattern, readPatterns } from '../src/patterns.js';
import { version } from '../src/version.js';

const program = new Command().name('seniormode').version(version)
  .description('Find engineering decisions or install the SeniorMode Agent Skill.')
  .addHelpText('after', '\nExamples:\n  seniormode search "duplicate payment after retry"\n  seniormode show payment-idempotency\n  seniormode install --agent codex --project .\n');

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

async function searchKnowledge(work) {
  const { createKnowledge } = await import('../src/knowledge.js');
  const knowledge = createKnowledge();
  try {
    return work(knowledge);
  } finally {
    knowledge.close();
  }
}

function readRecord(id) {
  const record = readPatterns().find(entry => entry.id === id);
  if (!record) throw new Error(`Unknown pattern: ${id}`);
  return record;
}

function printRecords(records, json) {
  if (json) {
    printJson(records);
  } else if (records.length) {
    console.log(records.map(record => `${record.id} · ${record.title}\n  ${record.summary}`).join('\n'));
  } else {
    console.log('No matching patterns.');
  }
}

function limit(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 20) {
    throw new InvalidArgumentError('Choose an integer from 1 to 20.');
  }
  return Number(value);
}

program.command('search <query...>').description('Search by engineering problem.')
  .option('--category <category>', categories.join(', '))
  .option('--limit <number>', 'Maximum number of results', limit, 5)
  .option('--json', 'Write structured JSON')
  .action((query, options) => searchKnowledge(knowledge => printRecords(knowledge.search(query.join(' '), options), options.json)));

program.command('list').description('List engineering records.')
  .option('--category <category>', categories.join(', '))
  .option('--json', 'Write structured JSON')
  .action(options => searchKnowledge(knowledge => printRecords(knowledge.list(options.category), options.json)));

program.command('show <id>').description('Read one decision record.')
  .option('--json', 'Write structured JSON')
  .action((id, options) => {
    const record = readRecord(id);
    if (options.json) printJson(record);
    else console.log(formatPattern(record));
  });

program.command('compare <id>').description('Show the decision rules for one record.')
  .action(id => printJson(readRecord(id).decisions));

program.command('checklist <id>').description('Show the verification checks for one record.')
  .action(id => printJson(readRecord(id).checks));

for (const [name, hint, action] of [
  ['install', 'Copy a managed skill into an existing project.', installSkill],
  ['update', 'Update a managed, unmodified copy.', (project, agent) => installSkill(project, agent, { update: true })],
  ['uninstall', 'Remove a managed, unmodified copy.', uninstallSkill],
  ['status', 'Check whether the skill is present in a project.', skillStatus],
]) {
  program.command(name).description(hint)
    .option('--project <directory>', 'Existing project directory', process.cwd())
    .option('--agent <agent>', Object.keys(agents).join(', '), 'codex')
    .option('--json', 'Write structured JSON')
    .action(options => {
      const result = action(options.project, options.agent);
      if (options.json) printJson(result);
      else console.log(`${result.state}${result.version ? ' · ' + result.version : ''} · ${result.path}`);
    });
}

program.command('mcp').description('Serve the local knowledge base over MCP stdio.')
  .action(async () => {
    const { startMcp } = await import('../src/mcp.js');
    await startMcp();
  });

try {
  await program.parseAsync(process.argv);
} catch (error) {
  console.error(`SeniorMode: ${error.message}`);
  process.exitCode = 1;
}
