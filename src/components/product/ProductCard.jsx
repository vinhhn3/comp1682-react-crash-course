import { Button } from '../common/Button';
import { formatCurrency } from '../../lib/formatCurrency';

/**
 * `product` is a model now, not a DTO. Note `product.price`, not `price_cents`.
 * The component never learns what the server calls things.
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
          <span className="price">{formatCurrency(product.price)}</span>
          <Button variant="ghost" onClick={() => onAdd(product)}>
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
