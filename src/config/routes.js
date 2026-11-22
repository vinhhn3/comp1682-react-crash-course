/**
 * Every path in one place. Links and routes read from the same object, so the
 * two can never drift apart.
 */
export const ROUTES = {
  shop: '/',
  cart: '/cart',
  productPattern: '/products/:id',
  product: (id) => `/products/${id}`,
};
