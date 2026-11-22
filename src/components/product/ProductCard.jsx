import { Button } from '../common/Button';

/**
 * Step 01: props in, JSX out. The Add button exists but has no handler yet.
 * Step 02 adds `onAdd` — and the component still knows nothing about carts.
 */
export function ProductCard({ product }) {
  return (
    <article className="card">
      <div className="card__art" aria-hidden="true">
        {product.emoji}
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.title}</h3>
        <div className="card__meta">
          <span>{product.category}</span>
          <span>·</span>
          <span>★ {product.rating.toFixed(1)}</span>
        </div>
        <div className="card__foot">
          <span className="price">${(product.price_cents / 100).toFixed(2)}</span>
          <Button variant="ghost">Add</Button>
        </div>
      </div>
    </article>
  );
}
