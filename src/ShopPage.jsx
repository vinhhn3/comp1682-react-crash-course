import { useState } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from './useProducts';

const ShopPage = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const { products, loading, error } = useProducts(query);

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
          onAdd={() => onAdd(product)}
        />
      ))}
    </>
  );
};

export default ShopPage;
