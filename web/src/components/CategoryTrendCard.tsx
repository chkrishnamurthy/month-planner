import type { Category } from '../firebase/budget';
import { formatCompactINR } from '../lib/format';
import Skeleton from './Skeleton';

interface Props {
  category: Category;
  series: number[];
}

export default function CategoryTrendCard({ category, series }: Props) {
  const latest = series[series.length - 1] || 0;
  const prev = series[series.length - 2] || 0;
  const delta = prev > 0 ? Math.round(((latest - prev) / prev) * 100) : 0;
  const max = Math.max(...series, 1);

  const deltaLabel =
    prev === 0 || latest === prev
      ? null
      : `${delta > 0 ? '↑' : '↓'} ${Math.abs(delta)}%`;
  const deltaColor =
    delta === 0
      ? 'text-muted-light dark:text-muted-dark'
      : delta > 0
      ? 'text-rose-500 dark:text-rose-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-9 h-9 rounded-xl grid place-items-center text-base shrink-0"
            style={{ backgroundColor: `${category.color}22`, color: category.color }}
            aria-hidden
          >
            {category.emoji}
          </span>
          <div className="min-w-0">
            <div className="text-sm text-muted-light dark:text-muted-dark">
              {category.name}
            </div>
            <div className="text-lg font-semibold num">
              {formatCompactINR(latest)}
            </div>
          </div>
        </div>
        {deltaLabel && (
          <div className={`text-xs font-semibold num ${deltaColor}`}>
            {deltaLabel}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end gap-1.5 h-12">
        {series.map((v, i) => {
          const isLast = i === series.length - 1;
          return (
            <div
              key={i}
              className="flex-1 rounded-md"
              style={{
                background: category.color,
                opacity: isLast ? 1 : 0.25 + (0.75 * (i + 1)) / series.length * 0.6,
                height: `${Math.max(8, (v / max) * 100)}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function CategoryTrendCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="min-w-0">
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        <Skeleton className="h-3 w-8" />
      </div>
      <div className="mt-4 flex items-end gap-1.5 h-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-md"
            height={`${Math.random() * 60 + 20}%`}
          />
        ))}
      </div>
    </div>
  );
}
