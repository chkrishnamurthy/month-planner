import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ErrorBanner from '../components/ErrorBanner';
import MonthCard, { MonthCardSkeleton } from '../components/MonthCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useMonths } from '../hooks/useMonths';
import { copyFromMonth, saveMonth } from '../firebase/budget';
import {
  currentMonthId,
  labelFromId,
  nextMonthId,
  previousMonthId,
} from '../lib/monthId';

interface NewMonthSheetProps {
  open: boolean;
  onClose: () => void;
  existingIds: string[];
  onCreated: (id: string) => void;
}

function NewMonthSheet({ open, onClose, existingIds, onCreated }: NewMonthSheetProps) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cur = currentMonthId();
  const candidateNext = nextMonthId(cur);
  const candidatePrev = previousMonthId(cur);

  const candidates = [candidatePrev, cur, candidateNext].filter(
    (id, i, a) => a.indexOf(id) === i && !existingIds.includes(id)
  );

  const [selected, setSelected] = useState(candidates[0] || cur);
  const [copy, setCopy] = useState(true);

  const sourceId = existingIds[0];

  const handleCreate = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (copy && sourceId) {
        await copyFromMonth(user.uid, sourceId, selected);
      } else {
        await saveMonth(user.uid, selected, {
          monthId: selected,
          salary: 0,
          expenses: {},
        });
      }
      onCreated(selected);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full sm:max-w-md bg-card-light dark:bg-card-dark rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border-t sm:border border-line-light dark:border-line-dark">
        <div className="label-eyebrow">New month</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Create a plan
        </h2>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
          Pick a month and optionally start from a copy.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2">
          {candidates.length === 0 && (
            <div className="text-sm text-muted-light dark:text-muted-dark">
              All recent months already exist.
            </div>
          )}
          {candidates.map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 border transition ${
                selected === id
                  ? 'border-accent bg-accent/10'
                  : 'border-line-light dark:border-line-dark'
              }`}
            >
              <span className="font-medium">{labelFromId(id)}</span>
              <span className="text-xs text-muted-light dark:text-muted-dark num">
                {id}
              </span>
            </button>
          ))}
        </div>

        {sourceId && (
          <label className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 border border-line-light dark:border-line-dark">
            <input
              type="checkbox"
              checked={copy}
              onChange={(e) => setCopy(e.target.checked)}
              className="w-4 h-4 accent-[#C7F051]"
            />
            <span className="flex-1 text-sm">
              Copy from{' '}
              <span className="font-semibold">{labelFromId(sourceId)}</span>
            </span>
          </label>
        )}

        {error && (
          <div className="mt-4">
            <ErrorBanner error={error} />
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-3 text-sm font-medium border border-line-light dark:border-line-dark"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={busy || candidates.length === 0}
            className="rounded-full px-4 py-3 text-sm font-semibold bg-accent text-accent-ink disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { months, loading: monthsLoading, error, reload } = useMonths();
  const { categories, loading: catsLoading } = useCategories();
  const [sheetOpen, setSheetOpen] = useState(false);

  const cur = currentMonthId();
  const existingIds = months.map((m) => m.monthId);
  const loading = monthsLoading || catsLoading;

  return (
    <div className="min-h-dvh pb-28 md:pb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16">
        <AppHeader section="02 · History" />

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <div className="label-eyebrow">History</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
              All months.
            </h1>
            <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">
              {months.length} {months.length === 1 ? 'plan' : 'plans'} saved · tap any to view or edit.
            </p>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="pill-accent shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            New month
          </button>
        </div>

        {error && (
          <div className="mt-5">
            <ErrorBanner error={error} onRetry={reload} />
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MonthCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? null : months.length === 0 ? (
          <div className="mt-10 card p-6 text-center">
            <p className="text-muted-light dark:text-muted-dark">
              No months yet. Create your first plan to get started.
            </p>
            <button
              onClick={() => setSheetOpen(true)}
              className="mt-4 pill-accent inline-flex"
            >
              + Create plan
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3">
            {months.map((m) => (
              <MonthCard
                key={m.monthId}
                month={m}
                categories={categories}
                isCurrent={m.monthId === cur}
              />
            ))}
          </div>
        )}
      </div>

      <NewMonthSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        existingIds={existingIds}
        onCreated={(id) => {
          setSheetOpen(false);
          reload().then(() => navigate(`/edit/${id}`));
        }}
      />

    </div>
  );
}
