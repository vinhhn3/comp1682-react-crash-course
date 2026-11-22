export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="/">
          Market
        </a>
        <nav className="nav">
          <a className="nav__link nav__link--active" href="/">
            Shop
          </a>
          <a className="nav__link" href="/cart">
            Cart
          </a>
        </nav>
        <button className="cart-button" type="button">
          Cart
          <span className="badge badge--muted">0</span>
        </button>
      </div>
    </header>
  );
}
