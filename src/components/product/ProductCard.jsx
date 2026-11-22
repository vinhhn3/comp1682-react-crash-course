import { Button } from '../common/Button';

/**
 * Step 02: one new prop, `onAdd`. The card still knows nothing about carts —
 * it just reports that a button was pressed.
 */
export function ProductCard({ product, onAdd }) {
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
          <Button variant="ghost" onClick={() => onAdd(product)}>
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
