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

const EMPTY_EXPENSES = { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 };

export const emptyMonth = (monthId) => ({
  monthId,
  salary: 0,
  expenses: { ...EMPTY_EXPENSES },
});

const monthsCol = (uid) => collection(db, 'users', uid, 'months');
const monthRef = (uid, monthId) => doc(db, 'users', uid, 'months', monthId);

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

export async function getMonth(uid, monthId) {
  const snap = await getDoc(monthRef(uid, monthId));
  if (!snap.exists()) return null;
  return sanitize({ monthId, ...snap.data() });
}

export async function saveMonth(uid, monthId, data) {
  const clean = sanitize({ ...data, monthId });
  await setDoc(
    monthRef(uid, monthId),
    { ...clean, updatedAt: serverTimestamp(), createdAt: serverTimestamp() },
    { merge: true }
  );
  return clean;
}

export async function listMonths(uid) {
  const q = query(monthsCol(uid), orderBy('monthId', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => sanitize({ monthId: d.id, ...d.data() }));
}

export async function copyFromMonth(uid, fromId, toId) {
  const source = await getMonth(uid, fromId);
  if (!source) throw new Error(`Month ${fromId} not found`);
  return saveMonth(uid, toId, { ...source, monthId: toId });
}
