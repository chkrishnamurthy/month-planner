import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listMonths } from '../firebase/budget';

export function useMonths() {
  const { user } = useAuth();
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listMonths(user.uid);
      setMonths(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { months, loading, error, reload };
}
