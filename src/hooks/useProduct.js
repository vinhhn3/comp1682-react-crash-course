import { useEffect, useState } from 'react';
import { productService } from '../services/productService';

/** Same contract as useProducts: data, loading, error, reload. One resource instead of a list. */
export function useProduct(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    setLoading(true);
    setError(null);

    productService
      .getById(id, { signal: controller.signal })
      .then((product) => {
        if (!alive) return;
        setData(product);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive || err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [id, tick]);

  return { data, loading, error, reload: () => setTick((n) => n + 1) };
}
