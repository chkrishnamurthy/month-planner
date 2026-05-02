import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Expenses } from '../lib/categories';

export interface MonthData {
  monthId: string;
  salary: number;
  expenses: Expenses;
}

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

export const emptyMonth = (monthId: string): MonthData => ({
  monthId,
  salary: 0,
  expenses: { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 },
});

const monthsCol = (uid: string) =>
  collection(db, 'users', uid, 'months');

const monthRef = (uid: string, monthId: string) =>
  doc(db, 'users', uid, 'months', monthId);

export async function getMonth(uid: string, monthId: string): Promise<MonthData | null> {
  try {
    const snap = await getDoc(monthRef(uid, monthId));
    if (!snap.exists()) return null;
    return sanitize({ monthId, ...snap.data() });
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
      console.warn('Network offline, returning null for getMonth:', monthId);
      return null;
    }
    throw error;
  }
}

export async function saveMonth(
  uid: string,
  monthId: string,
  data: Partial<MonthData>
): Promise<MonthData> {
  const clean = sanitize({ ...data, monthId });
  await setDoc(
    monthRef(uid, monthId),
    { ...clean, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return clean;
}

export async function listMonths(uid: string): Promise<MonthData[]> {
  try {
    const q = query(monthsCol(uid), orderBy('monthId', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => sanitize({ monthId: d.id, ...d.data() }));
  } catch (error: any) {
    if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
      console.warn('Network offline, returning empty array for listMonths');
      return [];
    }
    throw error;
  }
}

export async function copyFromMonth(
  uid: string,
  fromId: string,
  toId: string
): Promise<MonthData> {
  const source = await getMonth(uid, fromId);
  if (!source) throw new Error(`Month ${fromId} not found`);
  return saveMonth(uid, toId, { ...source, monthId: toId });
}
