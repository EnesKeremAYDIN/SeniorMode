import { fileURLToPath } from 'node:url';

export const benchmarkMcpName = 'seniormode';
const entry = fileURLToPath(new URL('../bin/seniormode.js', import.meta.url));

export function benchmarkMcpOverrides() {
  const prefix = 'mcp_servers.' + benchmarkMcpName;
  return [
    '-c', prefix + '.command=' + JSON.stringify(process.execPath),
    '-c', prefix + '.args=' + JSON.stringify([entry, 'mcp']),
    '-c', prefix + '.required=true',
  ];
}
