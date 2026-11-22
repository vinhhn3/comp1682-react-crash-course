import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { DevPanel } from './components/common/DevPanel';
import { logEvent } from './lib/devlog';

/**
 * Step 06: the products side is layered. The cart side is not yet — the state
 * and every action still live here, and `count` still travels down through
 * AppLayout to Header. That is step 07.
 */
export default function App() {
  const [page, setPage] = useState('products');
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    logEvent('state', 'App.addToCart', product.id);
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  }

  function setQty(id, qty) {
    logEvent('state', 'App.setQty', `${id} → ${qty}`);
    setCart((current) =>
      qty <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }

  function removeLine(id) {
    logEvent('state', 'App.removeLine', id);
    setCart((current) => current.filter((line) => line.id !== id));
  }

  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  return (
    <>
      <AppLayout page={page} count={count} onNavigate={setPage}>
        {page === 'products' ? (
          <ProductsPage onAdd={addToCart} />
        ) : (
          <CartPage
            cart={cart}
            onQty={setQty}
            onRemove={removeLine}
            onShop={() => setPage('products')}
          />
        )}
      </AppLayout>

      <DevPanel info={{ page, cartCount: count, cartTotal: total }} />
    </>
  );
}
