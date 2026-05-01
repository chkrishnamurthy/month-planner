// ── Local-storage backend (no Firebase) ──────────────────────────────────────

import type { Expenses } from '../lib/categories';

export interface MonthData {
  monthId: string;
  salary: number;
  expenses: Expenses;
}

type StoredMonths = Record<string, MonthData & { updatedAt?: string }>;

const EMPTY_EXPENSES: Expenses = { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 };

export const emptyMonth = (monthId: string): MonthData => ({
  monthId,
  salary: 0,
  expenses: { ...EMPTY_EXPENSES },
});

const sanitize = (data: Partial<MonthData> & { monthId: string }): MonthData => ({
  monthId: data.monthId,
  salary: Number(data.salary) || 0,
  expenses: {
    rent:   Number(data.expenses?.rent)   || 0,
    food:   Number(data.expenses?.food)   || 0,
    travel: Number(data.expenses?.travel) || 0,
    bills:  Number(data.expenses?.bills)  || 0,
    misc:   Number(data.expenses?.misc)   || 0,
  },
});

function storageKey(uid: string): string {
  return `planner_months_${uid}`;
}

function readAll(uid: string): StoredMonths {
  try {
    return JSON.parse(localStorage.getItem(storageKey(uid)) || '{}') as StoredMonths;
  } catch {
    return {};
  }
}

function writeAll(uid: string, data: StoredMonths): void {
  localStorage.setItem(storageKey(uid), JSON.stringify(data));
}

export async function getMonth(uid: string, monthId: string): Promise<MonthData | null> {
  const all = readAll(uid);
  if (!all[monthId]) return null;
  return sanitize({ ...all[monthId], monthId });
}

export async function saveMonth(uid: string, monthId: string, data: Partial<MonthData>): Promise<MonthData> {
  const clean = sanitize({ ...data, monthId });
  const all = readAll(uid);
  all[monthId] = { ...clean, updatedAt: new Date().toISOString() };
  writeAll(uid, all);
  return clean;
}

export async function listMonths(uid: string): Promise<MonthData[]> {
  const all = readAll(uid);
  return Object.values(all)
    .map((d) => sanitize({ ...d, monthId: d.monthId }))
    .sort((a, b) => (a.monthId < b.monthId ? 1 : -1));
}

export async function copyFromMonth(uid: string, fromId: string, toId: string): Promise<MonthData> {
  const source = await getMonth(uid, fromId);
  if (!source) throw new Error(`Month ${fromId} not found`);
  return saveMonth(uid, toId, { ...source, monthId: toId });
}
