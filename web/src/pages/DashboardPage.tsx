import { Link, useNavigate } from 'react-router-dom';
import AllocationDonut, { AllocationDonutSkeleton } from '../components/AllocationDonut';
import AppHeader from '../components/AppHeader';
import CategoryRow, { CategoryRowSkeleton } from '../components/CategoryRow';
import ErrorBanner from '../components/ErrorBanner';
import RemainingCard from '../components/RemainingCard';
import StatTile, { StatTileSkeleton } from '../components/StatTile';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useMonth } from '../hooks/useMonth';
import { totalExpenses } from '../lib/categories';
import { formatCompactINR } from '../lib/format';
import { currentMonthId, daysInMonth, dayOfMonth, labelFromId, todayLabel } from '../lib/monthId';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const monthId = currentMonthId();
  const { month, loading: monthLoading, error } = useMonth(monthId);
  const { categories, loading: catsLoading } = useCategories();

  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const total = totalExpenses(month?.expenses);
  const salary = Number(month?.salary) || 0;
  const left = salary - total;
  const saveRate = salary > 0 ? Math.round((left / salary) * 100) : 0;
  const days = daysInMonth(monthId);
  const dayLeft = Math.max(0, days - dayOfMonth());
  const loading = monthLoading || catsLoading;

  return (
    <div className="min-h-dvh pb-28 md:pb-10">
      {/* Fluid container — fills all available space, scales padding at each breakpoint */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16">
        <AppHeader section="01 · Dashboard" />

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="label-eyebrow">Today · {todayLabel()}</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
              Hi {firstName}.
            </h1>
            <p className="mt-2 text-muted-light dark:text-muted-dark">
              Here's how {labelFromId(monthId)} is shaping up.
            </p>
          </div>
          <Link to={`/edit/${monthId}`} className="pill-ghost shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit plan
          </Link>
        </div>

        {error && (
          <div className="mt-5">
            <ErrorBanner error={error} />
          </div>
        )}

        {loading ? (
          /*
           * Skeleton mirrors the real 3-col grid:
           * mobile → 1 col | md → 2 col (col 3 spans 2) | xl → 3 col
           */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-start">
            {/* Col 1 skeleton: Remaining */}
            <div className="card-hero p-6 sm:p-8 animate-pulse">
              <div className="h-3 w-28 rounded bg-white/20 mb-4" />
              <div className="h-16 w-3/4 rounded bg-white/20 mb-3" />
              <div className="h-1.5 rounded-full bg-white/10 w-full mt-6" />
            </div>

            {/* Col 2 skeleton: Allocation */}
            <section className="card p-5 sm:p-6">
              <div className="h-4 w-24 rounded bg-line-light dark:bg-line-dark mb-3 animate-pulse" />
              <AllocationDonutSkeleton />
              <ul className="mt-4 divide-y divide-line-light dark:divide-line-dark">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}><CategoryRowSkeleton showPercent compact /></li>
                ))}
              </ul>
            </section>

            {/* Col 3 skeleton: Stats + Quick edit — spans 2 cols at md */}
            <div className="md:col-span-2 xl:col-span-1 flex flex-col gap-5">
              <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-3">
                <StatTileSkeleton /><StatTileSkeleton />
                <StatTileSkeleton /><StatTileSkeleton />
              </section>
              <section className="card p-2 sm:p-3">
                <div className="p-3 text-sm font-semibold">Quick edit</div>
                <ul className="divide-y divide-line-light dark:divide-line-dark">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="px-2"><CategoryRowSkeleton compact /></li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ) : error ? null : !month ? (
          <div className="mt-10 card p-8 text-center text-muted-light dark:text-muted-dark">
            No plan for this month yet.{' '}
            <Link to={`/edit/${monthId}`} className="underline text-neutral-900 dark:text-white">
              Create one
            </Link>
            .
          </div>
        ) : (
          /*
           * 3-column grid:
           *   mobile → 1 col stacked
           *   md     → 2 cols: [RemainingCard | AllocationSection], then [Stats+QuickEdit spanning 2]
           *   xl     → 3 cols: [RemainingCard | AllocationSection | Stats+QuickEdit]
           */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-start">

            {/* ── Col 1: Remaining ── */}
            <RemainingCard month={month} isCurrent />

            {/* ── Col 2: Allocation breakdown ── */}
            <section className="card p-5 sm:p-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-sm font-semibold">Allocation</div>
                <div className="text-xs text-muted-light dark:text-muted-dark">
                  {formatCompactINR(salary)} salary
                </div>
              </div>
              <div className="mt-3 flex flex-col items-center gap-4">
                <AllocationDonut month={month} categories={categories} />
                <ul className="w-full divide-y divide-line-light dark:divide-line-dark">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <CategoryRow
                        category={cat}
                        amount={month.expenses[cat.id] || 0}
                        total={total}
                        showPercent
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Col 3: Stats tiles + Quick edit
                   md: spans both columns (full-width row below Col1+Col2)
                   xl: occupies the third column ── */}
            <div className="md:col-span-2 xl:col-span-1 flex flex-col gap-5">
              <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-3">
                <StatTile label="Salary"    value={formatCompactINR(salary)} />
                <StatTile label="Planned"   value={formatCompactINR(total)} />
                <StatTile label="Save Rate" value={`${saveRate}%`} accent />
                <StatTile label="Days Left" value={dayLeft} />
              </section>

              <section className="card p-2 sm:p-3">
                <div className="flex items-center justify-between p-3">
                  <div className="text-sm font-semibold">Quick edit</div>
                  <Link to={`/edit/${monthId}`} className="pill-ghost !py-1.5 !px-3 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                    Edit all
                  </Link>
                </div>
                <ul className="divide-y divide-line-light dark:divide-line-dark">
                  {categories.map((cat) => (
                    <li key={cat.id} className="px-2">
                      <CategoryRow
                        category={cat}
                        amount={month.expenses[cat.id] || 0}
                        total={total}
                        compact
                        onClick={() => navigate(`/edit/${monthId}`)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
