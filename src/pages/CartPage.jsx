import { CartLine } from '../components/cart/CartLine';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';

export function CartPage({ cart, onQty, onRemove, onShop }) {
  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Cart</h1>
        <p className="page-sub">Nothing here yet.</p>

        <div style={{ marginTop: 24 }}>
          <EmptyState title="Your cart is empty">Pick something from the shop.</EmptyState>
        </div>

        <button className="btn btn--primary" type="button" style={{ marginTop: 16 }} onClick={onShop}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Cart</h1>
          <p className="page-sub">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="cart">
        <div className="cart__lines">
          {/* key={line.id} — identity, not position. See docs/step-03.md for the
              thirty-second demo that proves why the index is wrong. */}
          {cart.map((line) => (
            <CartLine key={line.id} line={line} onQty={onQty} onRemove={onRemove} />
          ))}
        </div>

        <CartSummary items={cart} />
      </div>
    </div>
  );
}
