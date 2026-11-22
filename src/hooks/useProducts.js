import { useCallback, useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { useDebounce } from './useDebounce';
import { logEvent } from '../lib/devlog';

/**
 * The whole loading story in one place: debounce, fetch, abort, error, retry.
 *
 * The important line is the cleanup: `controller.abort()`. When `query` changes,
 * React runs the previous cleanup BEFORE the new effect. The old request is
 * cancelled, so it can never overwrite the new result.
 */
export function useProducts(query = '') {
  const searchTerm = useDebounce(query, 300);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    setLoading(true);
    setError(null);
    logEvent('hook', 'useProducts', `q="${searchTerm}"`);

    productService
      .getAll({ query: searchTerm, signal: controller.signal })
      .then((items) => {
        if (!alive) return;
        setData(items);
        setLoading(false);
        logEvent('hook', 'useProducts', `${items.length} items`);
      })
      .catch((err) => {
        if (!alive || err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
        logEvent('hook', 'useProducts', `error: ${err.message}`);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [searchTerm, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  return { data, loading, error, reload, searchTerm };
}
