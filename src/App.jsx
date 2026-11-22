import { Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

const App = () => {
  return (
    <CartProvider>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;
