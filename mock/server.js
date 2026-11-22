/**
 * A fake backend. This file is NOT app code.
 *
 * It stands in for a server you do not own. It has latency, it can be aborted,
 * and it persists the cart in localStorage so a refresh does not lose it.
 *
 * Slow it down with ?chaos=slow=2 (this is how we demonstrate the request race).
 */

const CART_KEY = 'market.cart.v1';

const PRODUCTS = [
  { id: 'p1',  title: 'Aero Mug',       category: 'Kitchen', price_cents: 2400,  rating: 4.6, emoji: '☕',  stock_qty: 42, created_at: '2025-02-11T09:00:00Z' },
  { id: 'p2',  title: 'Halo Headphones', category: 'Audio',  price_cents: 8900,  rating: 4.8, emoji: '🎧',  stock_qty: 12, created_at: '2025-01-04T09:00:00Z' },
  { id: 'p3',  title: 'Fern Pot',        category: 'Home',   price_cents: 3200,  rating: 4.2, emoji: '🪴',  stock_qty: 30, created_at: '2025-03-18T09:00:00Z' },
  { id: 'p4',  title: 'Slate Keyboard',  category: 'Desk',   price_cents: 12900, rating: 4.7, emoji: '⌨️',  stock_qty: 8,  created_at: '2025-02-27T09:00:00Z' },
  { id: 'p5',  title: 'Ember Candle',    category: 'Home',   price_cents: 1800,  rating: 4.4, emoji: '🕯️',  stock_qty: 60, created_at: '2025-04-02T09:00:00Z' },
  { id: 'p6',  title: 'Field Backpack',  category: 'Travel', price_cents: 7400,  rating: 4.5, emoji: '🎒',  stock_qty: 19, created_at: '2025-01-22T09:00:00Z' },
  { id: 'p7',  title: 'Cedar Soap',      category: 'Bath',   price_cents: 900,   rating: 4.1, emoji: '🧼',  stock_qty: 120, created_at: '2025-05-09T09:00:00Z' },
  { id: 'p8',  title: 'Arc Lamp',        category: 'Desk',   price_cents: 5600,  rating: 4.3, emoji: '💡',  stock_qty: 15, created_at: '2025-03-01T09:00:00Z' },
  { id: 'p9',  title: 'Line Stool',      category: 'Home',   price_cents: 9800,  rating: 4.0, emoji: '🪑',  stock_qty: 6,  created_at: '2024-12-15T09:00:00Z' },
  { id: 'p10', title: 'Clay Bottle',     category: 'Kitchen', price_cents: 3600, rating: 4.6, emoji: '🍶',  stock_qty: 24, created_at: '2025-04-21T09:00:00Z' },
  { id: 'p11', title: 'Canvas Cap',      category: 'Wear',   price_cents: 2200,  rating: 4.2, emoji: '🧢',  stock_qty: 55, created_at: '2025-05-30T09:00:00Z' },
  { id: 'p12', title: 'Wall Clock',      category: 'Home',   price_cents: 4200,  rating: 4.5, emoji: '🕰️',  stock_qty: 11, created_at: '2025-02-02T09:00:00Z' },
];

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

let cart = readCart();

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function slowBy() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('chaos') ?? '';
  const fromChaos = raw.startsWith('slow') ? raw.split('=')[1] : 0;
  return Number(params.get('slow') ?? fromChaos ?? 0) || 0;
}

/** Latency that respects an AbortSignal, like a real fetch. */
export function wait(signal) {
  const ms = 320 + slowBy() * 1000;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      },
      { once: true },
    );
  });
}

function cartPayload() {
  return {
    items: cart
      .map((line) => {
        const product = PRODUCTS.find((p) => p.id === line.product_id);
        return product ? { product_id: line.product_id, qty: line.qty, product } : null;
      })
      .filter(Boolean),
  };
}

export const mockApi = {
  async handle(method, path, body, { signal } = {}) {
    await wait(signal);

    const url = new URL(path, 'http://mock.local');
    const parts = url.pathname.split('/').filter(Boolean);

    // GET /products?q=
    if (method === 'GET' && parts[0] === 'products' && !parts[1]) {
      const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
      if (!q) return PRODUCTS;
      return PRODUCTS.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    }

    // GET /products/:id
    if (method === 'GET' && parts[0] === 'products' && parts[1]) {
      const product = PRODUCTS.find((p) => p.id === parts[1]);
      if (!product) throw new Error('404: product not found');
      return product;
    }

    // GET /cart
    if (method === 'GET' && parts[0] === 'cart') return cartPayload();

    // POST /cart  { product_id, qty }
    if (method === 'POST' && parts[0] === 'cart') {
      const id = body?.product_id;
      const qty = body?.qty ?? 1;
      if (!PRODUCTS.some((p) => p.id === id)) throw new Error('400: unknown product');
      const existing = cart.find((l) => l.product_id === id);
      if (existing) existing.qty += qty;
      else cart.push({ product_id: id, qty });
      saveCart();
      return cartPayload();
    }

    // PATCH /cart/:id  { qty }
    if (method === 'PATCH' && parts[0] === 'cart' && parts[1]) {
      const line = cart.find((l) => l.product_id === parts[1]);
      if (!line) throw new Error('404: line not found');
      line.qty = body?.qty ?? line.qty;
      if (line.qty <= 0) cart = cart.filter((l) => l.product_id !== parts[1]);
      saveCart();
      return cartPayload();
    }

    // DELETE /cart/:id
    if (method === 'DELETE' && parts[0] === 'cart' && parts[1]) {
      cart = cart.filter((l) => l.product_id !== parts[1]);
      saveCart();
      return cartPayload();
    }

    throw new Error(`404: ${method} ${path}`);
  },
};
