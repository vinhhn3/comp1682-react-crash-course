import { ProductCard } from './ProductCard';

/**
 * A list is `map` plus a `key`.
 * The key must be identity (product.id), never the array index.
 * `onAdd` is passed straight through — the list has no opinion about carts either.
 */
export function ProductList({ products, onAdd }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
