import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Category } from '../firebase/budget';
import {
  getCategories,
  createCategory as apiCreate,
  deleteCategory as apiDelete,
} from '../firebase/budget';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  createCategory: (data: { name: string; emoji: string; color: string }) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<Error | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, [user]);

  const createCategory = useCallback(
    async (data: { name: string; emoji: string; color: string }) => {
      const cat = await apiCreate(data);
      setCategories((prev) => [...prev, cat]);
      return cat;
    },
    []
  );

  const deleteCategory = useCallback(async (id: string) => {
    await apiDelete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { categories, loading, error, createCategory, deleteCategory };
}
