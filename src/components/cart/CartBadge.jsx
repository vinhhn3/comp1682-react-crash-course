import { useCart } from '../../context/CartContext';

/** No props. This is the whole point. */
export function CartBadge() {
  const { count } = useCart();
  return <span className={count > 0 ? 'badge' : 'badge badge--muted'}>{count}</span>;
}
