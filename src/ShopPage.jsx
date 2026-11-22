import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ShopPage = ({ onAdd }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?q=${query}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [query]);

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
