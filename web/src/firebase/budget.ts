import { auth } from './config';
import { getApiBaseUrl } from '../lib/env';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id:        string;
  name:      string;
  emoji:     string;
  color:     string;
  isDefault: boolean;
  createdAt: string;
}

export interface MonthData {
  monthId:  string;
  salary:   number;
  expenses: Record<string, number>; // categoryId → amount
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  lastLoginAt: string;
  createdAt: string;
  _count: { months: number };
}

export const emptyMonth = (monthId: string): MonthData => ({
  monthId,
  salary: 0,
  expenses: {},
});

// ─── HTTP client ──────────────────────────────────────────────────────────────

const API = getApiBaseUrl();

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
  return (await res.json()).data;
}

// ─── Category API ─────────────────────────────────────────────────────────────

export const getCategories = (): Promise<Category[]> =>
  request('/categories');

export const createCategory = (data: {
  name: string;
  emoji: string;
  color: string;
}): Promise<Category> =>
  request('/categories', { method: 'POST', body: JSON.stringify(data) });

export const deleteCategory = (id: string): Promise<void> =>
  request(`/categories/${id}`, { method: 'DELETE' });

// ─── Month API ────────────────────────────────────────────────────────────────

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
      salary:   data.salary   ?? 0,
      expenses: data.expenses ?? {},
    }),
  });
}

export async function listMonths(_uid: string): Promise<MonthData[]> {
  return request<MonthData[]>('/months');
}

export async function copyFromMonth(
  _uid: string,
  fromId: string,
  toId: string
): Promise<MonthData> {
  return request<MonthData>(`/months/${fromId}/copy`, {
    method: 'POST',
    body: JSON.stringify({ toMonthId: toId }),
  });
}

export async function getUserProfile(): Promise<UserProfile> {
  return request<UserProfile>('/users/me');
}
