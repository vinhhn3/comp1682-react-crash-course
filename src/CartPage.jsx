import { useCart } from './CartContext';

const CartPage = () => {
  const { cart, total } = useCart();

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="card">
      <h2>Cart</h2>
      {cart.map((item) => (
        <p key={item.id}>
          {item.qty} × {item.title} — ${item.price * item.qty}
        </p>
      ))}
      <p className="count">Total: ${total}</p>
    </div>
  );
};

export default CartPage;
