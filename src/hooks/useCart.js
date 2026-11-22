import { useCallback, useEffect, useState } from 'react';
import { cartService } from '../services/cartService';
import { logEvent } from '../lib/devlog';

/**
 * The behaviour. No JSX, no provider — just state and actions.
 * context/CartContext.jsx is what distributes this to the tree.
 */
export function useCartState() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    cartService
      .get()
      .then((lines) => {
        if (alive) setItems(lines);
      })
      .catch((err) => {
        if (alive) setError(err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const run = useCallback(async (action) => {
    try {
      setItems(await action());
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, []);

  const add = useCallback(
    (product) => {
      logEvent('hook', 'useCart.add', product.id);
      return run(() => cartService.add(product.id));
    },
    [run],
  );

  const setQty = useCallback(
    (id, qty) => {
      logEvent('hook', 'useCart.setQty', `${id} → ${qty}`);
      return run(() => (qty <= 0 ? cartService.remove(id) : cartService.setQty(id, qty)));
    },
    [run],
  );

  const remove = useCallback(
    (id) => {
      logEvent('hook', 'useCart.remove', id);
      return run(() => cartService.remove(id));
    },
    [run],
  );

  // Derived. Never stored.
  const count = items.reduce((sum, line) => sum + line.qty, 0);
  const total = items.reduce((sum, line) => sum + line.price * line.qty, 0);

  return { items, loading, error, count, total, add, setQty, remove };
}
