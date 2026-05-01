import { formatINR, pct } from '../lib/format';
import { remaining, totalExpenses } from '../lib/categories';
import { dayOfMonth, daysInMonth } from '../lib/monthId';

export default function RemainingCard({ month, isCurrent }) {
  const salary = Number(month?.salary) || 0;
  const total = totalExpenses(month?.expenses);
  const left = remaining(month);
  const overBudget = left < 0;
  const allocated = pct(total, salary);
  const days = daysInMonth(month?.monthId);
  const day = isCurrent ? dayOfMonth() : 1;

  return (
    <div
      className={`card-hero p-6 sm:p-8 transition-colors ${
        overBudget ? 'bg-red-950 text-red-100' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="label-eyebrow text-white/60">
            {overBudget ? 'Over budget' : 'Remaining for the month'}
          </div>
          <div
            className={`mt-2 num font-semibold tracking-tight leading-[0.95] text-[clamp(56px,16vw,112px)] ${
              overBudget ? 'text-red-300' : 'text-accent'
            }`}
          >
            {formatINR(Math.abs(left))}
          </div>
          <div className="mt-3 text-sm text-white/65">
            after {formatINR(total)} planned · {formatINR(salary)} salary
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full ${overBudget ? 'bg-red-400' : 'bg-accent'}`}
            style={{ width: `${Math.min(100, Math.max(0, allocated))}%` }}
          />
        </div>
        <div className="text-xs text-white/60 num whitespace-nowrap">
          {allocated}% allocated
        </div>
        <div className="text-xs text-white/60 num whitespace-nowrap hidden sm:block">
          Day {day} of {days}
        </div>
      </div>
    </div>
  );
}
