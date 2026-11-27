export function openTestProcessor(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS charges (
      account TEXT NOT NULL,
      intent TEXT NOT NULL,
      cents INTEGER NOT NULL,
      PRIMARY KEY (account, intent)
    );
  `);
  const insert = db.prepare(`
    INSERT INTO charges (account, intent, cents) VALUES (?, ?, ?)
    ON CONFLICT (account, intent) DO NOTHING
  `);
  const read = db.prepare('SELECT cents FROM charges WHERE account = ? AND intent = ?');
  return ({ account, intent, cents }, { loseResponse = false } = {}) => {
    insert.run(account, intent, cents);
    const receipt = read.get(account, intent);
    if (receipt.cents !== cents) return { status: 409 };
    if (loseResponse) throw new Error('Response lost after the processor recorded the charge');
    return { status: 200, intent, cents: receipt.cents };
  };
}
