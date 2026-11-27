function sorted(rows) {
  return rows.toSorted((a, b) => b.timestamp - a.timestamp || b.id - a.id);
}

export function pageByOffset(rows, offset, size) {
  return sorted(rows).slice(offset, offset + size);
}

export function pageAfter(rows, cursor, size) {
  return sorted(rows).filter(row => !cursor || row.timestamp < cursor.timestamp ||
    (row.timestamp === cursor.timestamp && row.id < cursor.id)).slice(0, size);
}
