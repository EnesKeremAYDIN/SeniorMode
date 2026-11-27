import { DatabaseSync } from 'node:sqlite';

export function openReservations(path) {
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS reservations (
      room TEXT NOT NULL,
      night TEXT NOT NULL,
      guest TEXT NOT NULL,
      PRIMARY KEY (room, night)
    );
  `);
  return db;
}

export function reserve(db, { room, night, guest }) {
  const result = db.prepare(`
    INSERT INTO reservations (room, night, guest) VALUES (?, ?, ?)
    ON CONFLICT (room, night) DO NOTHING
  `).run(room, night, guest);
  return { status: result.changes === 1 ? 201 : 409 };
}
