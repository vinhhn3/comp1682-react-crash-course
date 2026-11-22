import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartLine } from '../components/cart/CartLine';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';
import { ROUTES } from '../config/routes';

export function CartPage() {
  const { items, setQty, remove } = useCart();
  const count = items.reduce((sum, line) => sum + line.qty, 0);

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Cart</h1>
        <p className="page-sub">Nothing here yet.</p>

        <div style={{ marginTop: 24 }}>
          <EmptyState title="Your cart is empty">
            Pick something from the <Link to={ROUTES.shop}>shop</Link>.
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Cart</h1>
          <p className="page-sub">
            {count} {count === 1 ? 'item' : 'items'} — read from context, not passed down
          </p>
        </div>
      </div>

      <div className="cart">
        <div className="cart__lines">
          {items.map((line) => (
            <CartLine key={line.id} line={line} onQty={setQty} onRemove={remove} />
          ))}
        </div>

        <CartSummary items={items} />
      </div>
    </div>
  );
}
