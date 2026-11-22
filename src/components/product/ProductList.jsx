import { ProductCard } from './ProductCard';

/**
 * A list is `map` plus a `key`.
 * The key must be identity (product.id), never the array index.
 */
export function ProductList({ products }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
