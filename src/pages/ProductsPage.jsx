import { useState } from 'react';
import { ProductList } from '../components/product/ProductList';

const PRODUCTS = [
  { id: 'p1', title: 'Aero Mug', category: 'Kitchen', price_cents: 2400, rating: 4.6, emoji: '☕' },
  { id: 'p2', title: 'Halo Headphones', category: 'Audio', price_cents: 8900, rating: 4.8, emoji: '🎧' },
  { id: 'p3', title: 'Fern Pot', category: 'Home', price_cents: 3200, rating: 4.2, emoji: '🪴' },
  { id: 'p4', title: 'Slate Keyboard', category: 'Desk', price_cents: 12900, rating: 4.7, emoji: '⌨️' },
  { id: 'p5', title: 'Ember Candle', category: 'Home', price_cents: 1800, rating: 4.4, emoji: '🕯️' },
  { id: 'p6', title: 'Field Backpack', category: 'Travel', price_cents: 7400, rating: 4.5, emoji: '🎒' },
  { id: 'p7', title: 'Cedar Soap', category: 'Bath', price_cents: 900, rating: 4.1, emoji: '🧼' },
  { id: 'p8', title: 'Arc Lamp', category: 'Desk', price_cents: 5600, rating: 4.3, emoji: '💡' },
  { id: 'p9', title: 'Line Stool', category: 'Home', price_cents: 9800, rating: 4.0, emoji: '🪑' },
  { id: 'p10', title: 'Clay Bottle', category: 'Kitchen', price_cents: 3600, rating: 4.6, emoji: '🍶' },
  { id: 'p11', title: 'Canvas Cap', category: 'Wear', price_cents: 2200, rating: 4.2, emoji: '🧢' },
  { id: 'p12', title: 'Wall Clock', category: 'Home', price_cents: 4200, rating: 4.5, emoji: '🕰️' },
];

/**
 * Step 02: state lives here.
 *
 * Notice what this means: the header badge cannot see `cart`, and neither can a
 * cart page. That is not a bug in the code — it is the state living in the wrong
 * place. Step 03 lifts it to App, step 07 lifts it to a context.
 */
export function ProductsPage() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id);
      if (existing) {
        // new array, new object — never mutate
        return current.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  }

  const count = cart.reduce((total, line) => total + line.qty, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">
            Add works — but only this page can see the cart. The header badge still says 0.
          </p>
        </div>
        <span className="pill">{count} in cart</span>
      </div>

      <ProductList products={PRODUCTS} onAdd={addToCart} />
    </div>
  );
}
