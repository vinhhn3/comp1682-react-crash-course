import { Link, useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/formatCurrency';
import { ErrorCard } from '../components/common/ErrorCard';
import { ROUTES } from '../config/routes';

export function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading, error, reload } = useProduct(id);
  const { add } = useCart();

  if (loading) {
    return (
      <div className="page">
        <div className="state">
          <div className="spinner" />
          <p className="hint">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="crumbs">
          <Link to={ROUTES.shop}>Shop</Link>
          <span>/</span>
          <span>Not found</span>
        </div>
        <ErrorCard title="That product does not exist" error={error} onRetry={reload} />
        <Link className="btn btn--ghost" to={ROUTES.shop} style={{ marginTop: 16 }}>
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="crumbs">
        <Link to={ROUTES.shop}>Shop</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      <div className="detail">
        <div className="detail__art" aria-hidden="true">
          {product.emoji}
        </div>

        <div className="detail__body">
          <span className="pill">{product.category}</span>
          <h1 className="detail__title">{product.title}</h1>
          <div className="detail__price">{formatCurrency(product.price)}</div>
          <p className="detail__text">
            A demo product. The point of this page is not the copy — it is that <code>id</code> came
            from the URL, went into <code>useProduct</code>, and came back as a model.
          </p>
          <div className="spec">
            <span className="tag">★ {product.rating.toFixed(1)}</span>
            <span className="tag">{product.stock} in stock</span>
            <span className="tag">id: {product.id}</span>
          </div>
          <button className="btn btn--primary" type="button" onClick={() => add(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
