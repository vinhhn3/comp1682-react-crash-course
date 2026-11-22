import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { DevPanel } from './components/common/DevPanel';

/**
 * Step 07: App is no longer a warehouse for cart state.
 *
 * What is left here is navigation — a single piece of state that two screens
 * share. Context was the right tool for the cart because many distant components
 * read it. It is not the right tool for a value that only the header and one page
 * need. Both answers are in this file.
 */
export default function App() {
  const [page, setPage] = useState('products');

  return (
    <CartProvider>
      <AppLayout page={page} onNavigate={setPage}>
        {page === 'products' ? (
          <ProductsPage />
        ) : (
          <CartPage onShop={() => setPage('products')} />
        )}
      </AppLayout>

      <DevPanel />
    </CartProvider>
  );
}
