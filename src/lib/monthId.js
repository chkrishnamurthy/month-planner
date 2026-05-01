const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toMonthId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function currentMonthId() {
  return toMonthId(new Date());
}

export function parseMonthId(id) {
  const [y, m] = id.split('-').map(Number);
  return { year: y, month: m };
}

export function labelFromId(id) {
  const { year, month } = parseMonthId(id);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function shortLabelFromId(id) {
  const { year, month } = parseMonthId(id);
  return `${MONTH_NAMES[month - 1].slice(0, 3)} ${year}`.replace(` ${year}`, '');
}

export function todayLabel(date = new Date()) {
  const m = MONTH_NAMES[date.getMonth()];
  return `${m.toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;
}

export function daysInMonth(id) {
  const { year, month } = parseMonthId(id);
  return new Date(year, month, 0).getDate();
}

export function dayOfMonth(date = new Date()) {
  return date.getDate();
}

export function previousMonthId(id) {
  const { year, month } = parseMonthId(id);
  const d = new Date(year, month - 2, 1);
  return toMonthId(d);
}

export function nextMonthId(id) {
  const { year, month } = parseMonthId(id);
  const d = new Date(year, month, 1);
  return toMonthId(d);
}

export function lastNMonthIds(n, fromId = currentMonthId()) {
  const ids = [fromId];
  let cur = fromId;
  for (let i = 1; i < n; i += 1) {
    cur = previousMonthId(cur);
    ids.unshift(cur);
  }
  return ids;
}
