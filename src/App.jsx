import { useState } from 'react';
import Header from './Header';
import ShopPage from './ShopPage';
import CartPage from './CartPage';

const App = () => {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState('shop');

  const addToCart = (product) => {
    const found = cart.find((item) => item.id === product.id);

    if (found) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="app">
      <Header count={cart.length} page={page} onNavigate={setPage} />

      {page === 'shop' ? (
        <ShopPage onAdd={addToCart} />
      ) : (
        <CartPage cart={cart} total={total} />
      )}
    </div>
  );
};

export default App;
