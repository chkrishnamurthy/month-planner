export const CATEGORIES = [
  { key: 'rent', label: 'Rent', color: '#8AB4F8', emoji: '🏠' },
  { key: 'food', label: 'Food', color: '#FF9A6B', emoji: '🍽️' },
  { key: 'travel', label: 'Travel', color: '#F4D03F', emoji: '✈️' },
  { key: 'bills', label: 'Bills', color: '#A8E063', emoji: '⚡' },
  { key: 'misc', label: 'Misc', color: '#C9A8FF', emoji: '✨' },
];

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export const totalExpenses = (expenses = {}) =>
  CATEGORY_KEYS.reduce((sum, key) => sum + (Number(expenses[key]) || 0), 0);

export const remaining = (month) =>
  (Number(month?.salary) || 0) - totalExpenses(month?.expenses);
