import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

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
