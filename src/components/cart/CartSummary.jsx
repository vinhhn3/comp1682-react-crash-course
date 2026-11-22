import { useState } from 'react';

const SHIPPING = 400;
const FREE_OVER = 5000;

/**
 * Step 03: a form, and a lesson about derived state.
 * `subtotal`, `discount`, `shipping` and `total` are all computed from `items`
 * and `applied`. None of them is state. Two sources of truth means one is wrong.
 */
export function CartSummary({ items }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, line) => sum + line.price_cents * line.qty, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal - discount >= FREE_OVER ? 0 : SHIPPING;
  const total = subtotal - discount + shipping;

  function applyCoupon(event) {
    event.preventDefault();
    if (code.trim().toUpperCase() === 'SPRING') {
      setApplied('SPRING');
      setError('');
    } else {
      setApplied(null);
      setError('That code is not valid.');
    }
  }

  const money = (cents) => `$${(cents / 100).toFixed(2)}`;

  return (
    <aside className="cart-summary">
      <h3>Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="summary-row" style={{ color: 'var(--accent)' }}>
          <span>SPRING −10%</span>
          <span>−{money(discount)}</span>
        </div>
      )}

      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
      </div>

      <div className="summary-row summary-row--total">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>

      <form className="coupon" onSubmit={applyCoupon}>
        <input
          className="input"
          placeholder="Coupon code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError('');
          }}
        />
        <button className="btn btn--ghost" type="submit">
          Apply
        </button>
      </form>

      {error && <p style={{ color: 'var(--danger)', fontSize: 12.5 }}>{error}</p>}
      {!applied && !error && (
        <p className="hint">Try <code>SPRING</code> for 10% off.</p>
      )}

      <button className="btn btn--primary btn--block" type="button">
        Checkout
      </button>
    </aside>
  );
}
