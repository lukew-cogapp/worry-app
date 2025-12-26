import { useCallback, useState } from 'react';

/**
 * Custom hook for managing loading states of multiple items
 * Each item can have multiple concurrent actions (e.g., unlocking, dismissing)
 *
 * @example
 * const { loadingStates, setLoading, clearLoading } = useLoadingStates();
 * setLoading('worry-123', 'resolving');
 * // loadingStates['worry-123'] = { resolving: true }
 * clearLoading('worry-123', 'resolving');
 * // loadingStates['worry-123'] = { resolving: false }
 */
export function useLoadingStates<T extends string = string>() {
  const [loadingStates, setLoadingStates] = useState<Record<string, Partial<Record<T, boolean>>>>(
    {}
  );

  const setLoading = useCallback((id: string, action: T, loading = true) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [action]: loading },
    }));
  }, []);

  const clearLoading = useCallback(
    (id: string, action: T) => {
      setLoading(id, action, false);
    },
    [setLoading]
  );

  const isLoading = useCallback(
    (id: string, action: T) => {
      return loadingStates[id]?.[action] ?? false;
    },
    [loadingStates]
  );

  return {
    loadingStates,
    setLoading,
    clearLoading,
    isLoading,
  };
}
