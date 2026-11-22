const Header = ({ count }) => {
  return (
    <header className="header">
      <h1>Shop</h1>
      <span className="count">Cart: {count}</span>
    </header>
  );
};

export default Header;
