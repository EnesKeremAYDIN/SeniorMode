import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { Worker } from 'node:worker_threads';
import { openReservations } from '../examples/reservation.mjs';

const moduleUrl = new URL('../examples/reservation.mjs', import.meta.url).href;
const request = { room: 'last-room', night: '2030-06-14' };

test('independent reservation requests claim the last room only once', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'seniormode-reservation-'));
  const path = join(directory, 'inventory.sqlite');
  const db = openReservations(path);
  const gate = new Int32Array(new SharedArrayBuffer(4));
  const workers = [];
  t.after(async () => {
    await Promise.all(workers.map(worker => worker.terminate()));
    db.close();
    await rm(directory, { recursive: true });
  });
  for (const guest of ['Ada', 'Deniz']) {
    workers.push(new Worker(`
      const { parentPort, workerData } = require('node:worker_threads');
      (async () => {
        const { openReservations, reserve } = await import(workerData.moduleUrl);
        const db = openReservations(workerData.path);
        try {
          parentPort.postMessage('ready');
          Atomics.wait(workerData.gate, 0, 0, 5000);
          parentPort.postMessage(reserve(db, workerData.request));
        } finally { db.close(); }
      })().catch(error => { throw error; });
    `, { eval: true, workerData: { moduleUrl, path, gate, request: { ...request, guest } } }));
  }
  const ready = await Promise.all(workers.map(worker => once(worker, 'message')));
  assert.deepEqual(ready, [['ready'], ['ready']]);
  const results = Promise.all(workers.map(worker => once(worker, 'message')));
  Atomics.store(gate, 0, 1);
  Atomics.notify(gate, 0);
  const statuses = (await results).map(([response]) => response.status).sort();
  assert.deepEqual(statuses, [201, 409]);
  assert.equal(db.prepare('SELECT count(*) AS total FROM reservations').get().total, 1);
});
