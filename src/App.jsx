import { useState } from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, title: 'Aero Mug', category: 'Kitchen', price: 24 },
  { id: 2, title: 'Halo Headphones', category: 'Audio', price: 89 },
  { id: 3, title: 'Fern Pot', category: 'Home', price: 32 },
];

const App = () => {
  const [cart, setCart] = useState([]);

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
      <h1>Shop</h1>

      <p className="count">
        Cart: {cart.length} lines · ${total}
      </p>

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => addToCart(product)}
        />
      ))}

      {cart.length > 0 && (
        <div className="card">
          <h2>Cart</h2>
          {cart.map((item) => (
            <p key={item.id}>
              {item.qty} × {item.title} — ${item.price * item.qty}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
