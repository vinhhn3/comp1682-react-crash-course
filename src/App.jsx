import { useState } from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, title: 'Aero Mug', category: 'Kitchen', price: 24 },
  { id: 2, title: 'Halo Headphones', category: 'Audio', price: 89 },
  { id: 3, title: 'Fern Pot', category: 'Home', price: 32 },
];

const App = () => {
  const [count, setCount] = useState(0);

  const addToCart = () => {
    setCount(count + 1);
  };

  return (
    <div className="app">
      <h1>Shop</h1>

      <p className="count">Cart: {count}</p>

      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={addToCart} />
      ))}
    </div>
  );
};

export default App;
