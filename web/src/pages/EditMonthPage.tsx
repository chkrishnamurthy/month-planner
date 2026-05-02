import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCategoryModal from '../components/AddCategoryModal';
import AppHeader from '../components/AppHeader';
import CategoryInput from '../components/CategoryInput';
import ErrorBanner from '../components/ErrorBanner';
import FloatingSaveButton from '../components/FloatingSaveButton';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { useCategories } from '../hooks/useCategories';
import { useMonth } from '../hooks/useMonth';
import { totalExpenses } from '../lib/categories';
import { formatINR } from '../lib/format';
import { labelFromId } from '../lib/monthId';

type ExpenseFields = Record<string, number | string>;

export default function EditMonthPage() {
  const { monthId } = useParams<{ monthId: string }>();
  const navigate = useNavigate();
  const { month, loading, error, save } = useMonth(monthId);
  const { categories, loading: catsLoading, createCategory } = useCategories();

  const [salary, setSalary] = useState<number | string>('');
  const [expenses, setExpenses] = useState<ExpenseFields>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (month) {
      setSalary(month.salary || '');
      const fields: ExpenseFields = {};
      for (const [k, v] of Object.entries(month.expenses || {})) {
        fields[k] = v || '';
      }
      setExpenses(fields);
    }
  }, [month]);

  const numericExpenses = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(expenses).map(([k, v]) => [k, Number(v) || 0])
      ) as Record<string, number>,
    [expenses]
  );
  const total = totalExpenses(numericExpenses);
  const numericSalary = Number(salary) || 0;
  const left = numericSalary - total;
  const overBudget = left < 0;

  const handleSalary = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setSalary(raw === '' ? '' : Number(raw));
  };

  const handleSave = async () => {
    if (!monthId) return;
    setSaving(true);
    setSaveError(null);
    try {
      await save({
        monthId,
        salary: numericSalary,
        expenses: numericExpenses,
      });
      setShowToast(true);
      setTimeout(() => navigate(-1), 600);
    } catch (err) {
      setSaveError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSaving(false);
    }
  };

  const label = monthId ? labelFromId(monthId) : '';
  const isLoading = loading || catsLoading;

  return (
    <div className="min-h-dvh pb-32">
      <div className="mx-auto max-w-xl lg:max-w-5xl px-5">
        <AppHeader section="Edit plan" />

        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="pill-ghost !py-1.5 !px-3 text-xs"
            aria-label="Back"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <span className="label-eyebrow">{label}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Plan {label}.
        </h1>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
          Set your salary and allocate each category. Numbers update live.
        </p>

        {(error || saveError) && (
          <div className="mt-4">
            <ErrorBanner error={error || saveError} />
          </div>
        )}

        {isLoading ? (
          <div className="mt-10 flex justify-center text-muted-light dark:text-muted-dark">
            <Spinner size={28} />
          </div>
        ) : (
          <div className="mt-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
            <div className="flex flex-col gap-5">
              <section
                className={`card-hero p-6 ${
                  overBudget ? 'bg-red-950 text-red-100' : ''
                }`}
              >
                <div className="label-eyebrow text-white/60">
                  {overBudget ? 'Over budget' : 'Remaining'}
                </div>
                <div
                  className={`mt-1 num text-5xl font-semibold tracking-tight ${
                    overBudget ? 'text-red-300' : 'text-accent'
                  }`}
                >
                  {formatINR(Math.abs(left))}
                </div>
                <div className="mt-1 text-sm text-white/65">
                  {formatINR(total)} planned · {formatINR(numericSalary)} salary
                </div>
              </section>

              <section className="card p-2 sm:p-3">
                <div className="px-3 pt-3 label-eyebrow">Salary</div>
                <label className="flex items-center gap-3 px-2 py-3">
                  <span className="w-10 h-10 rounded-xl grid place-items-center text-base shrink-0 bg-accent/30 text-accent-ink dark:text-accent">
                    💰
                  </span>
                  <span className="flex-1 text-sm font-medium">Monthly salary</span>
                  <span className="flex items-center gap-1 rounded-2xl bg-line-light/60 dark:bg-line-dark px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                    <span className="text-muted-light dark:text-muted-dark text-sm">
                      ₹
                    </span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={salary === 0 ? '' : salary}
                      placeholder="0"
                      onChange={handleSalary}
                      className="w-28 sm:w-32 bg-transparent text-right text-base font-semibold num outline-none"
                    />
                  </span>
                </label>
              </section>
            </div>

            <div className="mt-5 lg:mt-0">
              <section className="card p-2 sm:p-3">
                <div className="flex items-center justify-between px-3 pt-3">
                  <div className="label-eyebrow">Categories</div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="pill-ghost !py-1 !px-2.5 text-xs flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add
                  </button>
                </div>
                <ul className="divide-y divide-line-light dark:divide-line-dark">
                  {categories.map((cat) => (
                    <li key={cat.id} className="px-2">
                      <CategoryInput
                        category={cat}
                        value={expenses[cat.id] ?? ''}
                        onChange={(v) =>
                          setExpenses((prev) => ({ ...prev, [cat.id]: v }))
                        }
                      />
                    </li>
                  ))}
                </ul>
                {categories.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted-light dark:text-muted-dark">
                    No categories yet. Add one above.
                  </p>
                )}
              </section>
            </div>
          </div>
        )}
      </div>

      <FloatingSaveButton onClick={handleSave} saving={saving} disabled={isLoading} />
      <Toast message="Saved" show={showToast} onDone={() => setShowToast(false)} />

      <AddCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        existingNames={categories.map((c) => c.name)}
        onCreate={async (data) => { await createCategory(data); }}
      />
    </div>
  );
}
