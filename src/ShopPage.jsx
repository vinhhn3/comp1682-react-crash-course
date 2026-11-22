import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ShopPage = ({ onAdd }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong: {error}</p>;
  }

  return (
    <>
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
