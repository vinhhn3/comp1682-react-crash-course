import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';

/**
 * Step 03: the cart has been lifted to the nearest common parent.
 *
 * Both screens need it, so it lives here. Notice the cost: `count` and
 * `onNavigate` now travel App → AppLayout → Header. That is prop drilling, and
 * it is today's acceptable answer. Step 07 replaces it with a context.
 */
export default function App() {
  const [page, setPage] = useState('products');
  const [cart, setCart] = useState([]);

  function addToCart(product) {
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
    setCart((current) =>
      qty <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, qty } : line)),
    );
  }

  function removeLine(id) {
    setCart((current) => current.filter((line) => line.id !== id));
  }

  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <AppLayout page={page} count={count} onNavigate={setPage}>
      {page === 'products' ? (
        <ProductsPage onAdd={addToCart} />
      ) : (
        <CartPage cart={cart} onQty={setQty} onRemove={removeLine} onShop={() => setPage('products')} />
      )}
    </AppLayout>
  );
}
