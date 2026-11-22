import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { ProductList } from '../components/product/ProductList';
import { SearchBar } from '../components/product/SearchBar';

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 05 — the endpoint has moved out.

   The URL is gone from this file. If the backend changes, nothing here changes.
   But the effect is still here: three pieces of state, no abort, and the same
   four-line loading dance every screen will copy.

   That is step 06.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProductsPage({ onAdd }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    productService
      .getAll({ query })
      .then((data) => setProducts(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">The page asks for products. It no longer knows what a URL is.</p>
        </div>
        <span className="pill">{products.length} shown</span>
      </div>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {loading && (
        <div className="state">
          <div className="spinner" />
          <p className="hint">Loading products…</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-card" style={{ marginTop: 26 }}>
          <div className="error-card__body">
            <strong>Could not load products</strong>
            {error.message}
          </div>
          <button className="btn btn--ghost" type="button" onClick={() => setQuery((q) => q)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty" style={{ marginTop: 26 }}>
          <strong>No products match “{query}”.</strong>
          Try a different word.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductList products={products} onAdd={onAdd} />
      )}
    </div>
  );
}
