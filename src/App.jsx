import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/layout/AppLayout';
import { AppRouter } from './router/AppRouter';
import { DevPanel } from './components/common/DevPanel';

export default function App() {
  return (
    <CartProvider>
      <AppLayout>
        <AppRouter />
      </AppLayout>
      <DevPanel />
    </CartProvider>
  );
}
