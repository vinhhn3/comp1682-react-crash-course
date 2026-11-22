import { useEffect, useState } from 'react';

/**
 * Give a fast-changing value a moment to settle.
 * Every keystroke resets the timer; only the last one survives.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
