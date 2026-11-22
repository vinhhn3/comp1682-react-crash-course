import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { count } = useCart();

  return (
    <header className="header">
      <h1>Shop</h1>

      <nav className="nav">
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Cart ({count})</NavLink>
      </nav>
    </header>
  );
};

export default Header;
