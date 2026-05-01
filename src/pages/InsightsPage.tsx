import { useMemo } from 'react';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import CategoryTrendCard from '../components/CategoryTrendCard';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import TotalAllocatedBars from '../components/TotalAllocatedBars';
import { useAuth } from '../context/AuthContext';
import { useMonths } from '../hooks/useMonths';
import { CATEGORIES, totalExpenses } from '../lib/categories';
import { formatCompactINR } from '../lib/format';
import { currentMonthId, labelFromId, lastNMonthIds, shortLabelFromId } from '../lib/monthId';
import type { Expenses } from '../lib/categories';

interface SixMonthEntry {
  id: string;
  label: string;
  total: number;
  salary: number;
  expenses: Partial<Expenses>;
}

export default function InsightsPage() {
  const { months } = useMonths();
  const { loading, error } = useMonths();

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

  return (
    <div className="min-h-dvh pb-28">
      <div className="mx-auto max-w-xl px-5">
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
          <div className="mt-10 flex justify-center text-muted-light dark:text-muted-dark">
            <Spinner size={28} />
          </div>
        ) : !latest ? (
          <div className="mt-10 card p-6 text-center text-muted-light dark:text-muted-dark">
            No data yet. Save a month to see insights.
          </div>
        ) : (
          <>
            <section className="mt-6 card-hero p-6">
              <div className="label-eyebrow text-white/60">
                Savings rate · {labelFromId(latestId)}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="num text-7xl sm:text-8xl font-semibold text-accent leading-[0.9] tracking-tight">
                  {saveRate}
                </span>
                <span className="text-3xl font-semibold text-accent leading-none mb-2">
                  %
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="label-eyebrow text-white/60">Saved</div>
                  <div className="num text-xl font-semibold text-white">
                    {formatCompactINR(latestSaved)}
                  </div>
                </div>
                <div>
                  <div className="label-eyebrow text-white/60">Spent</div>
                  <div className="num text-xl font-semibold text-white">
                    {formatCompactINR(latestSpent)}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4 card p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-sm font-semibold">Total allocated</div>
                </div>
                <div className="label-eyebrow">6 months</div>
              </div>
              <div className="mt-3">
                <TotalAllocatedBars data={six} currentId={latestId} />
              </div>
            </section>

            <section className="mt-4">
              <div className="flex items-baseline justify-between mb-3">
                <div className="text-sm font-semibold">Category trends</div>
                <div className="label-eyebrow">vs last month</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((c) => (
                  <CategoryTrendCard
                    key={c.key}
                    categoryKey={c.key}
                    series={six.map((m) => Number(m.expenses?.[c.key]) || 0)}
                  />
                ))}
              </div>
            </section>

            <ProfileRow />
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function ProfileRow() {
  const { user, signOut } = useAuth();
  return (
    <section className="mt-6 card p-5 flex items-center gap-3">
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt=""
          className="w-10 h-10 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-line-light dark:bg-line-dark grid place-items-center text-sm">
          {user?.displayName?.[0] || '·'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {user?.displayName || user?.email}
        </div>
        <div className="text-xs text-muted-light dark:text-muted-dark truncate">
          {user?.email}
        </div>
      </div>
      <button
        onClick={signOut}
        className="pill-ghost !py-1.5 !px-3 text-xs"
      >
        Sign out
      </button>
    </section>
  );
}
