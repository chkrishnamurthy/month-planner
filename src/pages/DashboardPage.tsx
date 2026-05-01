import { Link, useNavigate } from 'react-router-dom';
import AllocationDonut from '../components/AllocationDonut';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import CategoryRow from '../components/CategoryRow';
import ErrorBanner from '../components/ErrorBanner';
import RemainingCard from '../components/RemainingCard';
import Spinner from '../components/Spinner';
import StatTile from '../components/StatTile';
import { useAuth } from '../context/AuthContext';
import { useMonth } from '../hooks/useMonth';
import { CATEGORIES, totalExpenses } from '../lib/categories';
import { formatCompactINR, pct } from '../lib/format';
import { currentMonthId, daysInMonth, dayOfMonth, labelFromId, todayLabel } from '../lib/monthId';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const monthId = currentMonthId();
  const { month, loading, error } = useMonth(monthId);

  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const total = totalExpenses(month?.expenses);
  const salary = Number(month?.salary) || 0;
  const left = salary - total;
  const saveRate = salary > 0 ? Math.round((left / salary) * 100) : 0;
  const days = daysInMonth(monthId);
  const dayLeft = Math.max(0, days - dayOfMonth());

  return (
    <div className="min-h-dvh pb-28">
      <div className="mx-auto max-w-xl px-5">
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

        {loading || !month ? (
          <div className="mt-10 flex justify-center text-muted-light dark:text-muted-dark">
            <Spinner size={28} />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <RemainingCard month={month} isCurrent />
            </div>

            <section className="mt-5 card p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-sm font-semibold">Allocation</div>
                  <div className="text-xs text-muted-light dark:text-muted-dark">
                    Where the {formatCompactINR(salary)} goes
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:flex sm:items-center sm:gap-6">
                <AllocationDonut month={month} />
                <ul className="mt-2 sm:mt-0 flex-1 divide-y divide-line-light dark:divide-line-dark">
                  {CATEGORIES.map((c) => (
                    <li key={c.key}>
                      <CategoryRow
                        categoryKey={c.key}
                        amount={month.expenses[c.key]}
                        total={total}
                        showPercent
                        compact
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3">
              <StatTile label="Salary" value={formatCompactINR(salary)} />
              <StatTile label="Planned" value={formatCompactINR(total)} />
              <StatTile
                label="Save Rate"
                value={`${saveRate}%`}
                accent
              />
              <StatTile label="Days Left" value={dayLeft} />
            </section>

            <section className="mt-4 card p-2 sm:p-3">
              <div className="flex items-center justify-between p-3">
                <div className="text-sm font-semibold">Quick edit</div>
                <Link
                  to={`/edit/${monthId}`}
                  className="pill-ghost !py-1.5 !px-3 text-xs"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  Edit all
                </Link>
              </div>
              <ul className="divide-y divide-line-light dark:divide-line-dark">
                {CATEGORIES.map((c) => (
                  <li key={c.key} className="px-2">
                    <CategoryRow
                      categoryKey={c.key}
                      amount={month.expenses[c.key]}
                      total={total}
                      compact
                      onClick={() => navigate(`/edit/${monthId}`)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
