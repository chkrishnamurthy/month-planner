import { auth } from './config';
import type { Expenses } from '../lib/categories';

export interface MonthData {
  monthId: string;
  salary: number;
  expenses: Expenses;
}

export const emptyMonth = (monthId: string): MonthData => ({
  monthId,
  salary: 0,
  expenses: { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 },
});

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export async function getMonth(_uid: string, monthId: string): Promise<MonthData | null> {
  return request<MonthData | null>(`/months/${monthId}`);
}

export async function saveMonth(
  _uid: string,
  monthId: string,
  data: Partial<MonthData>
): Promise<MonthData> {
  return request<MonthData>('/months', {
    method: 'POST',
    body: JSON.stringify({
      monthId,
      salary: data.salary ?? 0,
      expenses: data.expenses ?? { rent: 0, food: 0, travel: 0, bills: 0, misc: 0 },
    }),
  });
}

export async function listMonths(_uid: string): Promise<MonthData[]> {
  return request<MonthData[]>('/months');
}

export async function copyFromMonth(_uid: string, fromId: string, toId: string): Promise<MonthData> {
  return request<MonthData>(`/months/${fromId}/copy`, {
    method: 'POST',
    body: JSON.stringify({ toMonthId: toId }),
  });
}
