import { CartBadge } from '../cart/CartBadge';

/**
 * Step 07: the cart props are gone. `count` used to travel App → AppLayout →
 * Header. Now the badge reads it from context and the middle two components
 * do not know the cart exists.
 *
 * Navigation is still props — and that is correct. Not everything belongs in a
 * context.
 */
export function Header({ page, onNavigate }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button className="brand" type="button" onClick={() => onNavigate('products')}>
          Market
        </button>

        <nav className="nav">
          <button
            className={`nav__link ${page === 'products' ? 'nav__link--active' : ''}`}
            type="button"
            onClick={() => onNavigate('products')}
          >
            Shop
          </button>
          <button
            className={`nav__link ${page === 'cart' ? 'nav__link--active' : ''}`}
            type="button"
            onClick={() => onNavigate('cart')}
          >
            Cart
          </button>
        </nav>

        <button className="cart-button" type="button" onClick={() => onNavigate('cart')}>
          Cart
          <CartBadge />
        </button>
      </div>
    </header>
  );
}
