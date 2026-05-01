import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { MonthData } from '../firebase/budget';
import { emptyMonth, getMonth, saveMonth } from '../firebase/budget';
import { currentMonthId } from '../lib/monthId';

interface UseMonthResult {
  month: MonthData | null;
  loading: boolean;
  error: Error | null;
  save: (data: Partial<MonthData>) => Promise<MonthData>;
}

export function useMonth(monthId: string | undefined): UseMonthResult {
  const { user } = useAuth();
  const [month, setMonth] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!monthId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const existing = await getMonth(user.uid, monthId);
        if (cancelled) return;
        if (existing) {
          setMonth(existing);
        } else if (monthId === currentMonthId()) {
          const seeded = emptyMonth(monthId);
          await saveMonth(user.uid, monthId, seeded);
          if (!cancelled) setMonth(seeded);
        } else {
          setMonth(emptyMonth(monthId));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user.uid, monthId]);

  const save = useCallback(
    async (data: Partial<MonthData>): Promise<MonthData> => {
      if (!monthId) throw new Error('No monthId');
      const saved = await saveMonth(user.uid, monthId, data);
      setMonth(saved);
      return saved;
    },
    [user.uid, monthId]
  );

  return { month, loading, error, save };
}
