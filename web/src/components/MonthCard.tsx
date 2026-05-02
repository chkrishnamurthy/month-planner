import { Link } from 'react-router-dom';
import type { MonthData } from '../firebase/budget';
import { CATEGORIES, totalExpenses } from '../lib/categories';
import { formatINR, pct } from '../lib/format';
import { labelFromId } from '../lib/monthId';

interface Props {
  month: MonthData;
  isCurrent?: boolean;
}

export default function MonthCard({ month, isCurrent }: Props) {
  const salary = Number(month?.salary) || 0;
  const total = totalExpenses(month?.expenses);
  const left = salary - total;
  const used = pct(total, salary);
  const segments = CATEGORIES.map((c) => ({
    color: c.color,
    weight: Number(month?.expenses?.[c.key]) || 0,
  })).filter((s) => s.weight > 0);
  const segTotal = segments.reduce((a, b) => a + b.weight, 0);

  return (
    <Link
      to={`/edit/${month.monthId}`}
      className="card p-5 sm:p-6 block hover:shadow-soft transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-muted-light dark:text-muted-dark">
          {labelFromId(month.monthId)}
        </div>
        {isCurrent && (
          <span className="rounded-full bg-accent text-accent-ink text-[10px] font-semibold px-2 py-0.5 tracking-wider">
            CURRENT
          </span>
        )}
      </div>
      <div className="mt-1 text-2xl sm:text-3xl font-semibold num tracking-tight">
        {formatINR(salary)}
      </div>

      <div className="mt-4 label-eyebrow">Left</div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-lg font-semibold num">{formatINR(left)}</div>
        <div className="text-xs text-muted-light dark:text-muted-dark num">
          {used}% used
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-line-light dark:bg-line-dark overflow-hidden">
        <div
          className="h-full bg-neutral-900 dark:bg-white"
          style={{ width: `${Math.min(100, Math.max(0, used))}%` }}
        />
      </div>
      {segTotal > 0 && (
        <div className="mt-3 flex gap-1.5 h-1 rounded-full overflow-hidden">
          {segments.map((s, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                background: s.color,
                width: `${(s.weight / segTotal) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
