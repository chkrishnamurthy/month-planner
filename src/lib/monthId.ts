const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toMonthId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function currentMonthId(): string {
  return toMonthId(new Date());
}

export function parseMonthId(id: string): { year: number; month: number } {
  const [y, m] = id.split('-').map(Number);
  return { year: y, month: m };
}

export function labelFromId(id: string): string {
  const { year, month } = parseMonthId(id);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function shortLabelFromId(id: string): string {
  const { month } = parseMonthId(id);
  return MONTH_NAMES[month - 1].slice(0, 3);
}

export function todayLabel(date: Date = new Date()): string {
  const m = MONTH_NAMES[date.getMonth()];
  return `${m.toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;
}

export function daysInMonth(id: string): number {
  const { year, month } = parseMonthId(id);
  return new Date(year, month, 0).getDate();
}

export function dayOfMonth(date: Date = new Date()): number {
  return date.getDate();
}

export function previousMonthId(id: string): string {
  const { year, month } = parseMonthId(id);
  const d = new Date(year, month - 2, 1);
  return toMonthId(d);
}

export function nextMonthId(id: string): string {
  const { year, month } = parseMonthId(id);
  const d = new Date(year, month, 1);
  return toMonthId(d);
}

export function lastNMonthIds(n: number, fromId: string = currentMonthId()): string[] {
  const ids: string[] = [fromId];
  let cur = fromId;
  for (let i = 1; i < n; i += 1) {
    cur = previousMonthId(cur);
    ids.unshift(cur);
  }
  return ids;
}
