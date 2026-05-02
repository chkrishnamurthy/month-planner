export const totalExpenses = (expenses: Record<string, number> = {}): number =>
  Object.values(expenses).reduce((sum, v) => sum + (Number(v) || 0), 0);

export const remaining = (month?: { salary?: number; expenses?: Record<string, number> }): number =>
  (Number(month?.salary) || 0) - totalExpenses(month?.expenses);
