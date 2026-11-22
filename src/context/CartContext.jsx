import { createContext, useContext, useEffect } from 'react';
import { useCartState } from '../hooks/useCart';
import { logEvent } from '../lib/devlog';

const CartContext = createContext(null);

/**
 * The provider does one thing: publish the value.
 * All the behaviour lives in hooks/useCart.js.
 */
export function CartProvider({ children }) {
  const value = useCartState();

  useEffect(() => {
    logEvent('context', 'CartProvider', `items: ${value.items.length}`);
  }, [value.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Fails loudly instead of returning null — a missing provider is a wiring bug. */
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside <CartProvider>');
  return value;
}
