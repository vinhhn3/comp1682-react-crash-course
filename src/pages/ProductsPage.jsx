import { useEffect, useState } from 'react';
import { mockApi } from '../../mock/server';
import { ProductList } from '../components/product/ProductList';
import { SearchBar } from '../components/product/SearchBar';

/* ─────────────────────────────────────────────────────────────────────────────
   ⛔ STEP 04 — THIS FILE IS DELIBERATELY WRONG.

   It works. That is the problem. Five things are in the wrong place:

   1. The endpoint ("/products?q=") lives in a component.
   2. Every screen that needs products will copy this effect.
   3. There is no abort. Type fast and the slowest answer wins.
   4. loading / error / empty are re-invented per component.
   5. You cannot test any of it without a browser and a network.

   Step 05 moves the endpoint down into services/.
   Step 06 moves the effect down into hooks/, and adds the abort.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProductsPage({ onAdd }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    mockApi
      .handle('GET', `/products?q=${encodeURIComponent(query)}`)
      .then((data) => setProducts(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">The data comes from a server now. This file is the mess we will fix.</p>
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
