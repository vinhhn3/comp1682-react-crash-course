import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/product/ProductList';
import { SearchBar } from '../components/product/SearchBar';
import { ErrorCard } from '../components/common/ErrorCard';
import { EmptyState } from '../components/common/EmptyState';

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 06 — one line of data logic.

   Every line that used to be here (three useStates, the effect, the abort, the
   loading flags) now lives in hooks/useProducts.js, where every other screen can
   reuse it and where it can be tested without a browser.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProductsPage({ onAdd }) {
  const [query, setQuery] = useState('');
  const { data, loading, error, reload, searchTerm } = useProducts(query);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">Same behaviour as step 04. Different address.</p>
        </div>
        <span className="pill">{data.length} shown</span>
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
        <ErrorCard title="Could not load products" error={error} onRetry={reload} />
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState title={`No products match “${searchTerm}”.`}>
          Try a different word.
        </EmptyState>
      )}

      {!loading && !error && data.length > 0 && <ProductList products={data} onAdd={onAdd} />}
    </div>
  );
}
