import { Link, NavLink } from 'react-router-dom';
import { CartBadge } from '../cart/CartBadge';
import { ROUTES } from '../../config/routes';

/**
 * Step 08: no props. The active link comes from the URL, the badge comes from
 * context, and the shell no longer knows that pages exist.
 */
export function Header() {
  const linkClass = ({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`;

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to={ROUTES.shop}>
          Market
        </Link>

        <nav className="nav">
          <NavLink to={ROUTES.shop} end className={linkClass}>
            Shop
          </NavLink>
          <NavLink to={ROUTES.cart} className={linkClass}>
            Cart
          </NavLink>
        </nav>

        <Link className="cart-button" to={ROUTES.cart}>
          Cart
          <CartBadge />
        </Link>
      </div>
    </header>
  );
}
