const Header = ({ count, page, onNavigate }) => {
  return (
    <header className="header">
      <h1>Shop</h1>

      <nav className="nav">
        <button onClick={() => onNavigate('shop')}>Shop</button>
        <button onClick={() => onNavigate('cart')}>Cart ({count})</button>
      </nav>
    </header>
  );
};

export default Header;
