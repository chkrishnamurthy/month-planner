import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { emptyMonth, getMonth, saveMonth } from '../firebase/budget';
import { currentMonthId } from '../lib/monthId';

export function useMonth(monthId) {
  const { user } = useAuth();
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !monthId) return;
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
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, monthId]);

  const save = useCallback(
    async (data) => {
      if (!user) throw new Error('Not authenticated');
      const saved = await saveMonth(user.uid, monthId, data);
      setMonth(saved);
      return saved;
    },
    [user, monthId]
  );

  return { month, loading, error, save };
}
