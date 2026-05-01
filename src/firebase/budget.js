// ── Local-storage backend (no Firebase) ──────────────────────────────────────

const EMPTY_EXPENSES = { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 };

export const emptyMonth = (monthId) => ({
  monthId,
  salary: 0,
  expenses: { ...EMPTY_EXPENSES },
});

const sanitize = (data) => ({
  monthId: data.monthId,
  salary: Number(data.salary) || 0,
  expenses: {
    rent: Number(data.expenses?.rent) || 0,
    food: Number(data.expenses?.food) || 0,
    travel: Number(data.expenses?.travel) || 0,
    bills: Number(data.expenses?.bills) || 0,
    misc: Number(data.expenses?.misc) || 0,
  },
});

function storageKey(uid) {
  return `planner_months_${uid}`;
}

function readAll(uid) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(uid)) || '{}');
  } catch {
    return {};
  }
}

function writeAll(uid, data) {
  localStorage.setItem(storageKey(uid), JSON.stringify(data));
}

export async function getMonth(uid, monthId) {
  const all = readAll(uid);
  if (!all[monthId]) return null;
  return sanitize({ monthId, ...all[monthId] });
}

export async function saveMonth(uid, monthId, data) {
  const clean = sanitize({ ...data, monthId });
  const all = readAll(uid);
  all[monthId] = { ...clean, updatedAt: new Date().toISOString() };
  writeAll(uid, all);
  return clean;
}

export async function listMonths(uid) {
  const all = readAll(uid);
  return Object.values(all)
    .map((d) => sanitize({ monthId: d.monthId, ...d }))
    .sort((a, b) => (a.monthId < b.monthId ? 1 : -1));
}

export async function copyFromMonth(uid, fromId, toId) {
  const source = await getMonth(uid, fromId);
  if (!source) throw new Error(`Month ${fromId} not found`);
  return saveMonth(uid, toId, { ...source, monthId: toId });
}
