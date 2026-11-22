import { useState } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from './useProducts';
import { useCart } from './CartContext';

const ShopPage = () => {
  const [query, setQuery] = useState('');
  const { products, loading, error } = useProducts(query);
  const { addToCart } = useCart();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong: {error}</p>;
  }

  return (
    <>
      <input
        className="input"
        placeholder="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={() => addToCart(product)}
        />
      ))}
    </>
  );
};

export default ShopPage;
