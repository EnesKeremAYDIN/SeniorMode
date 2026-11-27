export const discoveryCases = [
  {
    id: 'discover-music', mode: 'discovery', tags: ['greenfield', 'music-shuffle'],
    prompt: 'I’m building a small music app with a shuffle button. Before changing files, tell me what decisions matter and how you would check that playback feels right.',
    files: {},
    records: ['music-shuffle'],
    rubric: ['Identify uniform ordering and artist variety as distinct goals.',
      'Preserve every queue entry and explain the limit when the playlist is skewed.',
      'Propose a concrete, repeatable check for the intended behavior.'],
  },
  {
    id: 'discover-checkout', mode: 'discovery', tags: ['greenfield', 'payment-idempotency'],
    prompt: 'Plan an online checkout for my shop before writing code. Customers use phones on unreliable connections. Explain what can go wrong and the first checks you would run.',
    files: {},
    records: ['payment-idempotency'],
    rubric: ['Consider a reply lost after the payment took effect.',
      'Keep one purchase identity across retries and distinguish a separate purchase.',
      'Check that a lost reply and retry cause one charge.'],
  },
  {
    id: 'discover-booking', mode: 'discovery', tags: ['greenfield', 'reservation-concurrency'],
    prompt: 'I run a small hotel and want guests to reserve rooms online while staff take bookings at the desk. Plan the first version and explain what needs checking before you write code.',
    files: {},
    records: ['reservation-concurrency'],
    rubric: ['Identify contention for the same room and night across entry points.',
      'Protect availability at the shared write boundary.',
      'Propose two independent requests for the same room and verify one durable booking.'],
  },
];

export const nativeCases = [
  {
    id: 'greenfield-booking',
    tags: ['greenfield', 'reservation-concurrency'],
    record: 'reservation-concurrency',
    mode: 'build',
    prompt: `Build the reservation logic for my small hotel using the Node runtime already set up here. Implement and export reserve({ databasePath, room, night, guest }) from src/bookings.mjs. Return { status: 201 } for a new booking and { status: 409 } when that room is already booked for that night. The database file belongs to the application and callers can run in separate processes. Use no external services or new dependencies. Run useful checks and explain how you know the last room cannot be booked twice.`,
    files: {},
    checks: { functional: ['holds persist across connections', 'separate rooms and nights stay available'], edge: ['two independent writers compete for the last room'] },
  },
  {
    id: 'music-queue',
    tags: ['add-feature', 'music-shuffle'],
    record: 'music-shuffle',
    mode: 'build',
    prompt: `Add shuffle to my music app. Users can choose either equally likely track orderings or fewer back-to-back songs by the same artist. Keep buildQueue(tracks, mode, randomIndex) in src/queue.mjs with modes 'uniform' and 'variety'. Track objects have id and artist; return an array containing each original entry once without mutating the input. randomIndex(limit) returns an integer from 0 to limit - 1 and can be supplied by a test. Preserve current entry points. Explain the two promises to a listener and run checks.`,
    files: { 'src/queue.mjs': `export function buildQueue(tracks, mode, randomIndex) {
  return tracks.slice();
}
` },
    checks: { functional: ['every index choice produces a distinct three-track permutation', 'variety separates a balanced playlist'], edge: ['dominant artist preserves IDs and reaches one repeat', 'empty and singleton playlists are preserved'] },
  },
  {
    id: 'payment-retry',
    tags: ['fix-bug', 'payment-idempotency'],
    record: 'payment-idempotency',
    mode: 'build',
    prompt: `Fix duplicate charges in our checkout. Keep submitPayment(gateway, { account, requestId, cents }) in src/payments.mjs. The gateway accepts { key, cents } and exposes any permanent result for an identical key and amount after a lost response. Different accounts can use the same request ID for different purchases. Reusing an account's request ID with a changed amount must return status 409. An unknown transient gateway failure should still reach the caller so it can safely retry. Run checks and explain how the change avoids two charges.`,
    files: { 'src/payments.mjs': `import { randomUUID } from 'node:crypto';
export async function submitPayment(gateway, request) {
  return gateway.charge({ key: randomUUID(), cents: request.cents });
}
` },
    checks: { functional: ['retry after a lost reply has one durable charge', 'distinct accounts do not share a purchase identity'], edge: ['modified amount is rejected without another charge'] },
  },
  {
    id: 'feed-cursor',
    tags: ['add-feature', 'feed-pagination'],
    record: 'cursor-pagination',
    mode: 'build',
    prompt: `Items on our live feed sometimes appear twice as users scroll. Implement and export pageAfter(rows, cursor, size) alongside the existing code in src/feed.mjs. Rows arrive unordered and have numeric timestamp and unique numeric id. The feed sorts newest first and larger IDs first on tied timestamps. A cursor is null for the first page or the { timestamp, id } of the last item returned. Do not change pageByOffset for its existing callers. Verify the change and explain the behavior someone scrolling will notice.`,
    files: { 'src/feed.mjs': `export function pageByOffset(rows, offset, size) {
  return rows.toSorted((a, b) => b.timestamp - a.timestamp || b.id - a.id).slice(offset, offset + size);
}
` },
    checks: { functional: ['insertion does not duplicate previous-page IDs', 'preserves the existing offset function'], edge: ['tie order survives loss of the cursor row', 'empty input and input ordering are preserved'] },
  },
  {
    id: 'feed-audit',
    tags: ['find-bug', 'audit', 'feed-pagination'],
    record: 'cursor-pagination',
    mode: 'audit',
    prompt: `Investigate why the latest item can appear twice as someone scrolls our live feed. Inspect the code and report the affected file and line, trigger, user effect, smallest practical correction, and a concrete regression check. This task is a review. Keep all project files unchanged.`,
    files: { 'src/feed.mjs': `export function listPage(rows, page, size) {
  const order = rows.toSorted((a, b) => b.timestamp - a.timestamp || b.id - a.id);
  const start = page * size;
  return order.slice(start, start + size);
}
` },
    checks: { fixture: ['original fixture reproduces a duplicate after insertion'], decision: ['report cites the offset boundary, insertion, duplicate, and stable timestamp/ID cursor', 'leaves project files unchanged'] },
  },
  {
    id: 'shared-cents',
    tags: ['architecture-improvement', 'refactor', 'reuse', 'anti-overengineering'],
    record: 'module-boundaries',
    mode: 'build',
    prompt: `Refactor checkout and invoicing so cents are formatted consistently. Reuse the policy already in the workspace instead of duplicating it, and keep the two public named exports checkoutLabel(cents) and invoiceLabel(cents) in their existing files. These labels are sold in one currency: $12.00 for 1200 cents, $0.00 for 0, -$0.50 for -50, and invalid fractional cents must throw. Keep the change proportional to this project. Run relevant checks and explain what you reused.`,
    files: {
      'src/currency.mjs': `export function formatCents(cents) {
  if (!Number.isSafeInteger(cents)) throw new TypeError('Expected whole cents');
  const absolute = Math.abs(cents);
  return (cents < 0 ? '-$' : '$') + Math.floor(absolute / 100) + '.' + String(absolute % 100).padStart(2, '0');
}
`,
      'src/checkout.mjs': `export function checkoutLabel(cents) { return '$' + cents / 100; }
`,
      'src/invoice.mjs': `export function invoiceLabel(cents) { return '$' + ((cents / 100).toFixed(2)); }
`,
    },
    checks: { functional: ['both public entry points present consistent cents labels'], edge: ['negative, zero, and fractional cents are handled'], architecture: ['both entry points import the existing money policy', 'existing policy implementation is retained', 'no extra modules or runtime dependencies'] },
  },
  {
    id: 'document-ownership',
    tags: ['defensive-security', 'fix-bug'],
    record: 'authorization-object-scope',
    mode: 'build',
    prompt: `Fix this document-loading boundary so private documents stay within their owning account. Keep getDocument(documents, accountId, documentId) in src/documents.mjs. Records have accountId, id and body. A matching owner should receive their record and missing or non-owned records should return null so callers show the same not-found response. Different accounts may use the same document ID. Verify the behavior with synthetic records and explain the boundary in plain language.`,
    files: { 'src/documents.mjs': `export function getDocument(documents, accountId, documentId) {
  return documents.find(document => document.id === documentId) ?? null;
}
` },
    checks: { functional: ['the owner can read their own record', 'a non-owner receives the ordinary missing result'], edge: ['reused IDs resolve to the requesting account'] },
  },
];
