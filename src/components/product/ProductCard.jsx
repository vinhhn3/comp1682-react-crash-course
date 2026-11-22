import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { formatCurrency } from '../../lib/formatCurrency';
import { ROUTES } from '../../config/routes';

/**
 * The title is a real link, so the URL owns the navigation.
 * The Add button stays outside the link: a button inside an anchor is a bug.
 */
export function ProductCard({ product, onAdd }) {
  return (
    <article className="card">
      <div className="card__art" aria-hidden="true">
        {product.emoji}
      </div>
      <div className="card__body">
        <h3 className="card__title">
          <Link to={ROUTES.product(product.id)}>{product.title}</Link>
        </h3>
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
