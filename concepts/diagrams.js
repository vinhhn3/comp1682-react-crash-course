/* One diagram per step. Small primitives, composed by hand, rendered into the
   step page. Everything is HTML/CSS so it stays sharp on a projector. */

const box = (title, sub = '', cls = '') =>
  `<div class="dg-box ${cls}"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;

const arrow = (label = '') =>
  `<div class="dg-arrow">${label ? `<span>${label}</span>` : ''}</div>`;

const row = (...kids) => `<div class="dg-row">${kids.join('')}</div>`;

const stage = (...kids) => `<div class="dg-stage">${kids.join('')}</div>`;

const tree = (root, kids, label = '') => stage(root, arrow(label), row(...kids));

const split = (left, right, leftLabel = 'before', rightLabel = 'after') =>
  `<div class="dg-split">
     <div class="dg-panel"><span class="dg-cap">${leftLabel}</span>${left}</div>
     <div class="dg-panel"><span class="dg-cap">${rightLabel}</span>${right}</div>
   </div>`;

const note = (text) => `<p class="dg-note">${text}</p>`;

const codeBlock = (text) => `<pre class="dg-code">${text}</pre>`;

const mini = (title, cat, price) =>
  `<div class="dg-mini"><b>${title}</b><span>${cat}</span><span>${price}</span><em>Add to cart</em></div>`;

const snap = (tag, value, sub, cls = '') =>
  `<div class="dg-snap ${cls}"><span class="dg-cap">${tag}</span><b>${value}</b><small>${sub}</small></div>`;

const bars = (rows) => `
  <div class="dg-bars">
    ${rows
      .map(
        (r) => `<div class="dg-bar-row">
        <span class="dg-bar-label">${r.label}</span>
        <div class="dg-track"><div class="dg-bar ${r.cls || ''}" style="left:${r.left}%;width:${r.width}%">${r.text || ''}</div></div>
      </div>`,
      )
      .join('')}
    <div class="dg-ticks"><span>0s</span><span>1s</span><span>2s</span><span>3s</span></div>
  </div>`;

const folder = (name, files) =>
  `<div class="dg-folder"><b>${name}/</b>${files.map((f) => `<span>${f}</span>`).join('')}</div>`;

export const DIAGRAMS = {
  0: () =>
    stage(
      box('index.html', 'one empty div: #root'),
      arrow('Vite serves it'),
      box('main.jsx', 'render(&lt;App /&gt;)'),
      arrow('mounts into #root'),
      box('&lt;App /&gt;', 'a function that returns markup', 'a'),
      arrow('returns'),
      box('the page', 'an h1', 'ok'),
    ),

  1: () =>
    split(
      codeBlock(`&lt;div className="card"&gt;
  &lt;h2&gt;Aero Mug&lt;/h2&gt;
  &lt;p&gt;Kitchen&lt;/p&gt;
  &lt;p&gt;$24&lt;/p&gt;
  &lt;button&gt;Add to cart&lt;/button&gt;
&lt;/div&gt;`),
      `<div class="dg-stage">${mini('Aero Mug', 'Kitchen', '$24')}</div>`,
      'you write this',
      'the browser shows this',
    ),

  2: () =>
    stage(
      `<div class="dg-row">${mini('Aero Mug', 'Kitchen', '$24')}${mini('Halo Headphones', 'Audio', '$89')}${mini('Fern Pot', 'Home', '$32')}</div>`,
      note('the same six lines, three times — only the words change'),
      arrow('add a fourth product →'),
      box('one more copy', 'and one more, and one more', 'bad'),
    ),

  3: () =>
    stage(
      box('products', 'an array of 3 objects', 'a'),
      arrow('map((product) =&gt; …)'),
      box('3 elements', 'one &lt;div className="card"&gt; each'),
      arrow('key={product.id}'),
      box('the screen', '3 cards, in order', 'ok'),
    ),

  4: () =>
    tree(
      box('App', 'owns the products array'),
      [
        box('ProductCard', 'product = p1'),
        box('ProductCard', 'product = p2'),
        box('ProductCard', 'product = p3'),
      ],
      'props go down, never up',
    ),

  5: () =>
    stage(
      snap('render 1', 'count = 0', 'the button shows 0'),
      arrow('click → setCount(count + 1)'),
      snap('render 2', 'count = 1', 'a new constant, a new render', 'hot'),
      arrow('click twice in one handler'),
      snap('still render 2', 'count = 1', 'both reads saw the same 0', 'bad'),
    ),

  6: () =>
    stage(
      box('cart', '[{ Aero, qty 2 }, { Halo, qty 1 }]', 'a'),
      arrow('reduce((sum, item) =&gt; …)'),
      box('total', '$137', 'ok'),
      note('nothing stores the total. It is computed on every render.'),
    ),

  7: () =>
    tree(
      box('App', 'cart state lives here'),
      [
        box('Header', 'count'),
        box('ShopPage', 'onAdd'),
        box('CartPage', 'cart, total'),
      ],
      'the same value, three props',
    ),

  8: () =>
    tree(
      box('App', "page = 'shop'"),
      [box('ShopPage', 'shown', 'ok'), box('CartPage', 'not rendered', 'dim')],
      "page === 'shop' ? … : …",
    ),

  9: () =>
    stage(
      box('the component renders', 'nothing to show yet'),
      arrow('useEffect runs after render'),
      box('fetch(/api/products)', 'loading = true', 'a'),
      arrow('await res.json()'),
      box('setProducts(data)', 'loading = false', 'ok'),
      arrow('state changed'),
      box('render again', 'cards appear', 'hot'),
      note('if it throws → setError(err) → the error branch renders instead.'),
    ),

  10: () =>
    bars([
      { label: 'q="m"', left: 0, width: 92, text: 'slow — 2.8s' },
      { label: 'q="mu"', left: 17, width: 33, text: 'fast — 1.0s', cls: 'b' },
    ]) +
    note('“mu” answers first, then the old “m” answer lands last and overwrites it.'),

  11: () =>
    bars([
      { label: 'q="m"', left: 0, width: 17, text: 'aborted', cls: 'dead' },
      { label: 'q="mu"', left: 17, width: 33, text: 'wins', cls: 'b' },
    ]) +
    note('the cleanup calls controller.abort() before the next effect — the old answer can never land.'),

  12: () =>
    stage(
      box('ShopPage', 'asks for products'),
      arrow('useProducts(query)'),
      box('services/api.js', 'the only "/api" in src', 'a'),
      arrow('fetch'),
      box('json-server', 'localhost:8000', 'dim'),
      note('change the backend: one line, in one file.'),
    ),

  13: () =>
    split(
      codeBlock(`// ShopPage, step 12
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  ...
}, [query]);`),
      codeBlock(`// ShopPage, step 13
const { products, loading, error } =
  useProducts(query);`),
      'before — 25 lines',
      'after — 2 lines',
    ),

  14: () =>
    tree(
      box('CartProvider', 'cart, addToCart, count, total', 'hot'),
      [
        box('Header', 'useCart()'),
        box('ShopPage', 'useCart()'),
        box('CartPage', 'useCart()'),
      ],
      'no props — they ask the provider',
    ),

  15: () =>
    `<div class="dg-folders">
      ${folder('pages', ['ShopPage.jsx', 'CartPage.jsx'])}
      ${folder('components', ['Header.jsx', 'ProductCard.jsx'])}
      ${folder('hooks', ['useProducts.js'])}
      ${folder('services', ['api.js'])}
      ${folder('context', ['CartContext.jsx'])}
    </div>
    ${note('every file already existed — this step only changed their address')}`,

  16: () =>
    tree(
      box('BrowserRouter', 'reads window.location'),
      [box('/', 'ShopPage', 'ok'), box('/cart', 'CartPage', 'ok')],
      'Routes picks the element',
    ),
};
