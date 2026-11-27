import { benchmarkMcpName } from './native-mcp.js';

export function readAgentTrace(jsonl, expected) {
  const evidence = { skillOpened: false, mcpUsed: false, recordsFound: [], recordsOpened: [],
    standardsFound: [], standardsOpened: [], workflowsOpened: [], observedTests: [] };
  const found = new Set();
  const records = new Set();
  const standardsFound = new Set();
  const standardsOpened = new Set();
  const workflowsOpened = new Set();
  const tests = new Map();
  let answer = null;
  let usage = null;
  let turnCompleted = false;
  let providerLimited = false;
  const errors = [];
  for (const line of jsonl.split(/\r?\n/)) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event?.type === 'error' || event?.type === 'turn.failed') {
      const message = event.message ?? event.error?.message ?? '';
      if (message) errors.push(String(message).slice(0, 300));
      providerLimited ||= /\b429\b|rate limit|at capacity/i.test(String(message));
    }
    if (event?.type === 'turn.completed') {
      turnCompleted = true;
      usage = event.usage ?? null;
    }
    if (event?.type !== 'item.completed') continue;
    const item = event.item;
    if (item?.type === 'agent_message') answer = item.text;
    if (item?.type === 'mcp_tool_call' && item.server === benchmarkMcpName) {
      evidence.mcpUsed = true;
      if (item.status !== 'completed' || item.error) continue;
      const result = item.result?.structured_content;
      if (item.tool === 'search_patterns' && Array.isArray(result?.patterns)) {
        for (const pattern of result.patterns) {
          if (typeof pattern?.id === 'string') found.add(pattern.id);
        }
      }
      if (item.tool === 'list_standards' && Array.isArray(result?.standards)) {
        for (const standard of result.standards) {
          if (typeof standard?.id === 'string') standardsFound.add(standard.id);
        }
      }
      if (typeof result?.body === 'string' && result.body.trim() && typeof result.id === 'string' &&
          result.id === item.arguments?.id) {
        if (item.tool === 'get_pattern') records.add(result.id);
        if (item.tool === 'get_standard') standardsOpened.add(result.id);
        if (item.tool === 'get_workflow') workflowsOpened.add(result.id);
      }
      continue;
    }
    if (item?.type !== 'command_execution' || item.status !== 'completed') continue;
    const cmd = String(item.command).replaceAll('\\', '/');
    const stdout = String(item.aggregated_output ?? '');
    if (/\b(?:node\s+--test|npm\s+(?:run\s+)?test|pnpm\s+(?:run\s+)?test|yarn\s+test)\b/i.test(cmd)) {
      tests.set(item.id ?? tests.size, { exitCode: item.exit_code ?? null });
    }
    if (item.exit_code !== 0) continue;
    if (/(?:\.agents\/skills\/seniormode\/|seniormode\/)SKILL\.md\b/i.test(cmd)
        && /^name:\s*["']?seniormode["']?\s*$/im.test(stdout)) evidence.skillOpened = true;
    for (const match of cmd.matchAll(/references\/knowledge\/[\w-]+\/([\w-]+)\.md\b/g)) {
      const id = match[1];
      if (stdout.split(/\r?\n/).some(row => row.trim() === 'id: ' + id || row.trim() === 'id: "' + id + '"')) {
        records.add(id);
      }
    }
  }
  evidence.recordsOpened = [...records];
  evidence.recordsFound = [...found];
  evidence.standardsFound = [...standardsFound];
  evidence.standardsOpened = [...standardsOpened];
  evidence.workflowsOpened = [...workflowsOpened];
  const expectedRecords = Array.isArray(expected) ? expected : [expected];
  evidence.relevantRecordsOpened = expectedRecords.filter(id => records.has(id));
  evidence.relevantRecordOpened = evidence.relevantRecordsOpened.length > 0;
  evidence.observedTests = [...tests.values()];
  return { evidence, answer: typeof answer === 'string' ? answer.slice(0, 16_000) : null, usage, turnCompleted, errors, providerLimited };
}
