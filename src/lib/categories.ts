export type CategoryKey = 'rent' | 'food' | 'travel' | 'bills' | 'misc';

export type Expenses = Record<CategoryKey, number>;

export interface Category {
  key: CategoryKey;
  label: string;
  color: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { key: 'rent',   label: 'Rent',   color: '#8AB4F8', emoji: '🏠' },
  { key: 'food',   label: 'Food',   color: '#FF9A6B', emoji: '🍽️' },
  { key: 'travel', label: 'Travel', color: '#F4D03F', emoji: '✈️' },
  { key: 'bills',  label: 'Bills',  color: '#A8E063', emoji: '⚡' },
  { key: 'misc',   label: 'Misc',   color: '#C9A8FF', emoji: '✨' },
];

export const CATEGORY_KEYS: CategoryKey[] = CATEGORIES.map((c) => c.key);

export const totalExpenses = (expenses: Partial<Expenses> = {}): number =>
  CATEGORY_KEYS.reduce((sum, key) => sum + (Number(expenses[key]) || 0), 0);

export const remaining = (month?: { salary?: number; expenses?: Partial<Expenses> }): number =>
  (Number(month?.salary) || 0) - totalExpenses(month?.expenses);
