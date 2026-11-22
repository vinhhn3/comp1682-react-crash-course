import { Link, Route, Routes } from 'react-router-dom';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { EmptyState } from '../components/common/EmptyState';
import { ROUTES } from '../config/routes';

function NotFound() {
  return (
    <div className="page">
      <EmptyState title="Page not found">
        That URL does not match a route. <Link to={ROUTES.shop}>Go to the shop</Link>.
      </EmptyState>
    </div>
  );
}

/**
 * The URL decides which page renders. That is the whole change from step 07,
 * where `page` was a piece of state in App.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.shop} element={<ProductsPage />} />
      <Route path={ROUTES.productPattern} element={<ProductDetailPage />} />
      <Route path={ROUTES.cart} element={<CartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
