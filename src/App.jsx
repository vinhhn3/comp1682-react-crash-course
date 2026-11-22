import { useState } from 'react';
import { CartProvider } from './CartContext';
import Header from './Header';
import ShopPage from './ShopPage';
import CartPage from './CartPage';

const App = () => {
  const [page, setPage] = useState('shop');

  return (
    <CartProvider>
      <div className="app">
        <Header page={page} onNavigate={setPage} />

        {page === 'shop' ? <ShopPage /> : <CartPage />}
      </div>
    </CartProvider>
  );
};

export default App;
