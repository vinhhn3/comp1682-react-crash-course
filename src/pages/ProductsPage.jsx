import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { ProductList } from '../components/product/ProductList';
import { SearchBar } from '../components/product/SearchBar';
import { ErrorCard } from '../components/common/ErrorCard';
import { EmptyState } from '../components/common/EmptyState';

/* ─────────────────────────────────────────────────────────────────────────────
   STEP 07 — two hooks, no props.

   Data in from useProducts. Actions out through useCart. The page no longer
   receives onAdd, and no component above it has to know the cart exists.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProductsPage() {
  const [query, setQuery] = useState('');
  const { data, loading, error, reload, searchTerm } = useProducts(query);
  const { add } = useCart();

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">Data from a hook, actions from context. Nothing is passed in.</p>
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
        <EmptyState title={`No products match “${searchTerm}”.`}>Try a different word.</EmptyState>
      )}

      {!loading && !error && data.length > 0 && <ProductList products={data} onAdd={add} />}
    </div>
  );
}
