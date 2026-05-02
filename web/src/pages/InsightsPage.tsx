import { useMemo } from 'react';
import AppHeader from '../components/AppHeader';
import CategoryTrendCard, { CategoryTrendCardSkeleton } from '../components/CategoryTrendCard';
import ErrorBanner from '../components/ErrorBanner';
import Skeleton from '../components/Skeleton';
import TotalAllocatedBars, { TotalAllocatedBarsSkeleton } from '../components/TotalAllocatedBars';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useMonths } from '../hooks/useMonths';
import { totalExpenses } from '../lib/categories';
import { formatCompactINR } from '../lib/format';
import { currentMonthId, labelFromId, lastNMonthIds, shortLabelFromId } from '../lib/monthId';

interface SixMonthEntry {
  id: string;
  label: string;
  total: number;
  salary: number;
  expenses: Record<string, number>;
}

export default function InsightsPage() {
  const { months, loading: monthsLoading, error } = useMonths();
  const { categories, loading: catsLoading } = useCategories();

  const cur = currentMonthId();
  const sixIds = useMemo(() => lastNMonthIds(6), []);
  const byId = useMemo(
    () => Object.fromEntries(months.map((m) => [m.monthId, m])),
    [months]
  );
  const six = useMemo<SixMonthEntry[]>(
    () =>
      sixIds.map((id) => {
        const m = byId[id];
        const total = m ? totalExpenses(m.expenses) : 0;
        return {
          id,
          label: shortLabelFromId(id),
          total,
          salary: m?.salary || 0,
          expenses: m?.expenses || {},
        };
      }),
    [sixIds, byId]
  );

  const latest = byId[cur] || months[0];
  const latestId = latest?.monthId;
  const latestSalary = Number(latest?.salary) || 0;
  const latestSpent = totalExpenses(latest?.expenses);
  const latestSaved = Math.max(0, latestSalary - latestSpent);
  const saveRate = latestSalary > 0 ? Math.round((latestSaved / latestSalary) * 100) : 0;
  const loading = monthsLoading || catsLoading;

  return (
    <div className="min-h-dvh pb-28 md:pb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16">
        <AppHeader section="03 · Insights" />

        <div className="mt-4">
          <div className="label-eyebrow">Insights</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
            How you're tracking.
          </h1>
        </div>

        {error && (
          <div className="mt-5">
            <ErrorBanner error={error} />
          </div>
        )}

        {loading ? (
          /*
           * 3-col skeleton:
           *   md  → 2 cols: [savings | totalAlloc+trends]
           *   xl  → 3 cols: [savings | totalAlloc | trends]
           */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-start">
            <div className="flex flex-col gap-5">
              <section className="card-hero p-6">
                <Skeleton className="h-3 w-32 mb-3" />
                <div className="mt-3 flex items-end gap-1">
                  <Skeleton className="h-16 w-20 mb-2" />
                  <Skeleton className="h-8 w-6 mb-2" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-5 w-16" /></div>
                  <div><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-5 w-16" /></div>
                </div>
              </section>
              <div className="hidden md:block"><ProfileRow /></div>
            </div>

            <div className="flex flex-col gap-5 mt-5 md:mt-0">
              <section className="card p-5 sm:p-6">
                <div className="flex items-baseline justify-between mb-3">
                  <Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-16" />
                </div>
                <TotalAllocatedBarsSkeleton />
              </section>
              {/* trends at md only (hidden at xl, shown in col 3) */}
              <section className="xl:hidden">
                <div className="flex items-baseline justify-between mb-3">
                  <Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <CategoryTrendCardSkeleton key={i} />
                  ))}
                </div>
              </section>
              <div className="md:hidden"><ProfileRow /></div>
            </div>

            {/* Col 3 — xl only: category trends */}
            <div className="hidden xl:flex flex-col gap-5">
              <div className="flex items-baseline justify-between mb-3">
                <Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-20" />
              </div>
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CategoryTrendCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : error ? null : !latest ? (
          <div className="mt-10 card p-6 text-center text-muted-light dark:text-muted-dark">
            No data yet. Save a month to see insights.
          </div>
        ) : (
          /*
           * 3-column layout:
           *   mobile → 1 col stacked
           *   md     → 2 cols: [savings | totalAlloc+trends]
           *   xl     → 3 cols: [savings | totalAlloc | trends] — category trends
           *                     split into its own column so both charts fill the screen
           */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-start">

            {/* ── Col 1: Savings rate hero ── */}
            <div className="flex flex-col gap-5">
              <section className="card-hero p-6">
                <div className="label-eyebrow text-white/60">
                  Savings rate · {labelFromId(latestId)}
                </div>
                <div className="mt-3 flex items-end gap-1">
                  <span className="num text-7xl sm:text-8xl font-semibold text-accent leading-[0.9] tracking-tight">
                    {saveRate}
                  </span>
                  <span className="text-3xl font-semibold text-accent leading-none mb-2">%</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <div className="label-eyebrow text-white/60">Saved</div>
                    <div className="num text-xl font-semibold text-white">{formatCompactINR(latestSaved)}</div>
                  </div>
                  <div>
                    <div className="label-eyebrow text-white/60">Spent</div>
                    <div className="num text-xl font-semibold text-white">{formatCompactINR(latestSpent)}</div>
                  </div>
                </div>
              </section>
              <div className="hidden md:block"><ProfileRow /></div>
            </div>

            {/* ── Col 2: Total allocated bars (+ trends at md, hidden at xl) ── */}
            <div className="flex flex-col gap-5 mt-5 md:mt-0">
              <section className="card p-5 sm:p-6">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-semibold">Total allocated</div>
                  <div className="label-eyebrow">6 months</div>
                </div>
                <div className="mt-3">
                  <TotalAllocatedBars data={six} currentId={latestId} />
                </div>
              </section>

              {/* Category trends visible at md only (col 3 takes over at xl) */}
              {categories.length > 0 && (
                <section className="xl:hidden">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="text-sm font-semibold">Category trends</div>
                    <div className="label-eyebrow">vs last month</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <CategoryTrendCard
                        key={cat.id}
                        category={cat}
                        series={six.map((m) => Number(m.expenses?.[cat.id]) || 0)}
                      />
                    ))}
                  </div>
                </section>
              )}

              <div className="md:hidden"><ProfileRow /></div>
            </div>

            {/* ── Col 3: Category trends — xl+ only ── */}
            {categories.length > 0 && (
              <div className="hidden xl:flex flex-col gap-5">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-sm font-semibold">Category trends</div>
                  <div className="label-eyebrow">vs last month</div>
                </div>
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <CategoryTrendCard
                      key={cat.id}
                      category={cat}
                      series={six.map((m) => Number(m.expenses?.[cat.id]) || 0)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow() {
  const { user, signOut } = useAuth();
  return (
    <section className="card p-5 flex items-center gap-3">
      {user?.photoURL ? (
        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-line-light dark:bg-line-dark grid place-items-center text-sm">
          {user?.displayName?.[0] || '·'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{user?.displayName || user?.email}</div>
        <div className="text-xs text-muted-light dark:text-muted-dark truncate">{user?.email}</div>
      </div>
      <button onClick={signOut} className="pill-ghost !py-1.5 !px-3 text-xs">Sign out</button>
    </section>
  );
}
