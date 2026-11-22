import { ProductList } from '../components/product/ProductList';

// Step 01: the data is a constant in the page. Steps 04-06 move it to a server.
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

export function ProductsPage() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Shop</h1>
          <p className="page-sub">Static UI. The buttons do nothing yet.</p>
        </div>
        <span className="pill">{PRODUCTS.length} products</span>
      </div>

      <ProductList products={PRODUCTS} />
    </div>
  );
}
