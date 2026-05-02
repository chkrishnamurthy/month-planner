import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { MonthData } from '../firebase/budget';
import { listMonths } from '../firebase/budget';

interface UseMonthsResult {
  months: MonthData[];
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useMonths(): UseMonthsResult {
  const { user } = useAuth();
  const [months, setMonths]   = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listMonths(user.uid);
      setMonths(data);
    } catch (err) {
      console.error('useMonths fetch error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { months, loading, error, reload };
}
