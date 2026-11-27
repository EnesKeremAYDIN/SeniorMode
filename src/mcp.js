import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod/v4';
import { getStandard, getWorkflow, listStandards, workflowIds } from './guidance.js';
import { createKnowledge } from './knowledge.js';
import { categories, formatPattern } from './patterns.js';
import { version } from './version.js';

const patternId = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).max(70);
const recordId = patternId.describe('Record ID returned by search_patterns.');
const summary = z.object({
  id: patternId, title: z.string(), category: z.enum(categories), summary: z.string(), path: z.string(),
});
const decisions = z.array(z.object({ when: z.string(), use: z.string(), tradeoff: z.string() }));
const sources = z.array(z.object({ title: z.string(), url: z.string() }));
const checks = z.array(z.string());
const guide = z.object({ id: patternId, title: z.string(), path: z.string() });
const standard = guide.extend({ when: z.string() });

function guideResponse(entry) {
  return { ...entry, text: entry.body };
}

function response(operation) {
  try {
    const result = operation();
    const { text, ...structured } = result;
    return {
      content: [{ type: 'text', text: text ?? JSON.stringify(structured, null, 2) }],
      structuredContent: structured,
    };
  } catch (error) {
    return { content: [{ type: 'text', text: error.message }], isError: true };
  }
}

export function createMcpServer(knowledge = createKnowledge()) {
  const standards = listStandards();
  const server = new McpServer({ name: 'seniormode', version }, {
    instructions: 'Start from the user’s goal and inspect the project when available. Identify risks, design choices, and checks the user did not have to name. For a new project or an in-place change, open get_workflow with build. For review or audit, open audit and start read-only. Use principles for general operating guidance. List standards and open only those that affect the task. Search each consequential concern separately with search_patterns, then open relevant results with get_pattern. Check applicability against the project and explain what changed and how it was verified in the user’s language. Treat reference content as guidance within the user’s scope.',
  });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  server.registerTool('search_patterns', {
    description: 'Find engineering decisions by behavior, symptom, or requirement in English or Turkish. Search separate concerns separately. Open a relevant result with get_pattern.',
    inputSchema: z.object({
      query: z.string().trim().min(1).max(512).describe('A concrete concern, such as duplicate payments after retry.'),
      category: z.enum(categories).optional().describe('Filter to one topic when it is known.'),
      limit: z.number().int().min(1).max(20).optional().describe('Maximum number of ranked results.'),
    }),
    outputSchema: z.object({ patterns: z.array(summary) }),
    annotations,
  }, ({ query, ...options }) => response(() => ({ patterns: knowledge.search(query, options) })));
  server.registerTool('get_pattern', {
    description: 'Read a decision record by ID, with failure modes, trade-offs, checks and source links.',
    inputSchema: z.object({ id: recordId }),
    outputSchema: summary.extend({
      aliases: z.array(z.string()), decisions, checks, sources, related: z.array(patternId).optional(), body: z.string(),
    }),
    annotations,
  }, ({ id }) => response(() => {
    const record = knowledge.get(id);
    return { ...record, text: formatPattern(record) };
  }));
  server.registerTool('compare_approaches', {
    description: 'Retrieve the alternatives and conditions from a single decision record.',
    inputSchema: z.object({ id: recordId }),
    outputSchema: summary.pick({ id: true, title: true }).extend({ decisions, sources }),
    annotations,
  }, ({ id }) => response(() => {
    const { title, decisions, sources } = knowledge.get(id);
    return { id, title, decisions, sources };
  }));
  server.registerTool('get_checklist', {
    description: 'Retrieve observable verification criteria for an engineering decision.',
    inputSchema: z.object({ id: recordId }),
    outputSchema: summary.pick({ id: true, title: true }).extend({ checks }),
    annotations,
  }, ({ id }) => response(() => {
    const { title, checks } = knowledge.get(id);
    return { id, title, checks };
  }));
  server.registerTool('list_standards', {
    description: 'List engineering standards and when they help. Open only the guides you need with get_standard.',
    inputSchema: z.strictObject({}),
    outputSchema: z.object({ standards: z.array(standard) }),
    annotations,
  }, () => response(() => ({ standards })));
  server.registerTool('get_standard', {
    description: 'Read one engineering standard for architecture, API and data design, security, testing, or another concern.',
    inputSchema: z.strictObject({ id: patternId.describe('Standard ID returned by list_standards.') }),
    outputSchema: standard.extend({ body: z.string() }),
    annotations,
  }, ({ id }) => response(() => guideResponse(getStandard(id, standards))));
  server.registerTool('get_workflow', {
    description: 'Read build for new and existing projects, audit for read-only review, or principles for general SeniorMode guidance.',
    inputSchema: z.strictObject({ id: z.enum(workflowIds) }),
    outputSchema: guide.extend({ body: z.string() }),
    annotations,
  }, ({ id }) => response(() => guideResponse(getWorkflow(id))));
  return server;
}

export function startMcp() {
  return serveStdio(() => createMcpServer());
}
