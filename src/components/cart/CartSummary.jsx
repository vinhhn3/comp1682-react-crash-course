import { useState } from 'react';
import { formatCurrency } from '../../lib/formatCurrency';
import {
  COUPON_CODE,
  COUPON_RATE,
  FREE_SHIPPING_OVER,
  SHIPPING_FEE,
} from '../../config/constants';

/**
 * `subtotal`, `discount`, `shipping` and `total` are computed on every render.
 * None of them is state. Two sources of truth means one of them is eventually wrong.
 */
export function CartSummary({ items }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = applied ? subtotal * COUPON_RATE : 0;
  const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  function applyCoupon(event) {
    event.preventDefault();
    if (code.trim().toUpperCase() === COUPON_CODE) {
      setApplied(COUPON_CODE);
      setError('');
    } else {
      setApplied(null);
      setError('That code is not valid.');
    }
  }

  return (
    <aside className="cart-summary">
      <h3>Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="summary-row" style={{ color: 'var(--accent)' }}>
          <span>{COUPON_CODE} −10%</span>
          <span>−{formatCurrency(discount)}</span>
        </div>
      )}

      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
      </div>

      <div className="summary-row summary-row--total">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
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
        <p className="hint">
          Try <code>{COUPON_CODE}</code> for 10% off.
        </p>
      )}

      <button className="btn btn--primary btn--block" type="button">
        Checkout
      </button>
    </aside>
  );
}
