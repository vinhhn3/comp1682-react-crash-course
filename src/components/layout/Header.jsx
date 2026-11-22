/**
 * Step 03: navigation is a piece of state in App, passed down as `onNavigate`.
 * The header does not use `count` for anything except the badge, and it does not
 * use `page` for anything except the active class — but both have to arrive here
 * anyway. Remember this at 2:35.
 */
export function Header({ page, count, onNavigate }) {
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
          <span className={count > 0 ? 'badge' : 'badge badge--muted'}>{count}</span>
        </button>
      </div>
    </header>
  );
}
