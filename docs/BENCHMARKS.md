# Benchmarks

Run the benchmark commands from a source checkout with dependencies installed.

## Retrieval

`npm run benchmark` measures where the expected record ranks for 74 checked-in English and Turkish queries. The runner prints top-one, top-three and top-five totals and fails if a record misses the top three. These maintained fixtures do not estimate an agent’s success rate on unfamiliar tasks.

## Reproducible examples

Run `npm test` to execute the examples. The tests exercise one durable booking under contention, one stored payment after a lost reply, shuffle queue properties, and repeat-free feed traversal across an insertion. The README’s shuffle table and checkout walkthrough use results from these local examples.

## Discovery and implementation

The native benchmark compares the same prompts, starting files, model, sandbox and host across two fresh workspaces. The treatment uses the installed project skill by default. Use `--integration mcp` to give the treatment a local SeniorMode stdio server instead. Both modes use the same prompts without naming SeniorMode or including engineering records, tool results or reviewer judgments. The order of the two arms reverses on alternate repeats.

| Track | What the agent receives | Evidence |
|---|---|---|
| Discovery | Three ordinary requests about music, checkout, and hotel booking. Prompts omit the engineering technique and ask for a read-only plan. | Observed record and skill reads, successful MCP guidance calls, no workspace changes, reviewer rubric for unprompted risks, choices and verification. |
| Implementation and audit | Seven fixtures with expected behavior or a scoped read-only defect to investigate. | Independent executable behavior and edge checks, regression safety, source and dependency changes, and review of architecture and explanation. |

| Implementation fixture | Independent checks |
|---|---|
| `greenfield-booking` | Persistent bookings, separate rooms and nights, one winner across SQLite writers |
| `music-queue` | Six bounded Fisher–Yates outcomes, balanced and skewed playlists, IDs and boundary inputs |
| `payment-retry` | One charge after a lost reply, separate account identity, amount conflict |
| `feed-cursor` | Insertion, deleted cursor row, tied timestamps, preserved offset behavior |
| `feed-audit` | Reproduced duplicate, actionable finding, unchanged workspace |
| `shared-cents` | Caller behavior, reuse of the existing policy, proportional scope |
| `document-ownership` | Owner and non-owner behavior, account-scoped record IDs |

### Run locally

List the fixtures with `node benchmarks/agent-benchmark.js --track all`. Probe the existing environment without inference or downloads.

```sh
node benchmarks/agent-benchmark.js --probe
```

Use an installed loopback Ollama or LM Studio model that supports Codex tool calls. For implementation, use an existing local Node Docker image. Discovery is read-only and does not require Docker.

```sh
node benchmarks/agent-benchmark.js --live --track discovery --provider ollama --model MODEL
node benchmarks/agent-benchmark.js --live --track discovery --provider ollama --model MODEL --integration mcp
node benchmarks/agent-benchmark.js --live --track implementation --provider ollama --model MODEL --grader-image node:24-bookworm-slim
```

Use a disposable environment without sensitive files or globally installed copies of SeniorMode. The agent runs with workspace network disabled. The implementation grader runs generated code in a separate non-root container with read-only mounts, resource limits and no network. The runner writes local reports under ignored `benchmarks/runs/`. Review reports before sharing them. [Codex skill evaluation](https://developers.openai.com/blog/eval-skills)

### Read the results

- Skill mode records successful commands that return recognizable skill or record content. MCP mode distinguishes search results and standards listed from the full records, standards, and workflows opened. Failed calls and other MCP servers do not count. Other access paths can be invisible to the trace.
- Agent-reported test activity is distinct from the independent implementation checks. Discovery is scored from the answer and traces. For each rubric item and reviewer dimension, use 0 for absent or incorrect, 1 for partial and 2 for supported by evidence. Cite the relevant answer or code.
- Compare matched completed pairs and keep incomplete runs visible. Review decision quality, reuse, unnecessary complexity, regression safety and plain-language explanation. The runner reports token and elapsed-time deltas where observed and leaves human scores blank.
- Use a source checkout to run the fixture and grader tests. [Benchmark sources](https://github.com/EnesKeremAYDIN/SeniorMode/tree/v1.0.0/benchmarks)
