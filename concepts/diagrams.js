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


/* ── richer figures for the inline lessons ─────────────── */

const chip = (text, cls = '') => `<span class="fig-chip ${cls}">${text}</span>`;
const chips = (...items) => `<div class="fig-chips">${items.join('')}</div>`;

const phase = (label, ...steps) =>
  `<div class="fig-phase"><b>${label}</b>${steps.join('<span class="fig-arrow">→</span>')}</div>`;

const stepChip = (text, cls = '') => `<span class="fig-step ${cls}">${text}</span>`;

const pipeline = () =>
  stage(
    box('state change', 'setCount(1)', 'a'),
    arrow('React schedules a render'),
    box('render', 'React calls the component function again'),
    arrow('returns a new element tree'),
    box('reconcile', 'compare the new tree with the previous one'),
    arrow('the smallest set of changes'),
    box('commit', 'React updates the real DOM'),
    arrow('after the browser paints'),
    box('effect', 'useEffect runs, if its dependencies changed', 'ok'),
    note('A render is not a DOM update. React can render a component and throw the result away. The commit is the part that touches the page.'),
  );

const element = () =>
  stage(
    split(
      codeBlock(`&lt;h1 className="title"&gt;Shop&lt;/h1&gt;`),
      codeBlock(`React.createElement(
  'h1',
  { className: 'title' },
  'Shop',
)`),
      'you write this',
      'it becomes this call',
    ),
    arrow('the call returns a plain object'),
    box('{ type: "h1", props: { className: "title", children: "Shop" } }', 'an element, not a DOM node', 'a'),
    arrow('ReactDOM commits it'),
    box('&lt;h1 class="title"&gt;Shop&lt;/h1&gt;', 'the real DOM', 'ok'),
    note('JSX is not HTML. It is a function call that returns an object. React decides when that object becomes a DOM node.'),
  );

const keys = () => `
  <div class="dg-split">
    <div class="dg-panel">
      <span class="dg-cap">before</span>
      ${chips(chip('A · id 1', 'ok'), chip('B · id 2', 'ok'), chip('C · id 3', 'ok'))}
    </div>
    <div class="dg-panel">
      <span class="dg-cap">after: remove B, add D</span>
      ${chips(chip('A · id 1', 'ok'), chip('C · id 3', 'ok'), chip('D · id 4', 'new'))}
    </div>
  </div>
  <div class="dg-split" style="margin-top:12px">
    <div class="dg-panel">
      <span class="dg-cap">key={product.id}</span>
      ${chips(chip('A keeps its node', 'ok'), chip('B removed', 'bad'), chip('C keeps its node', 'ok'), chip('D is new', 'new'))}
      <p class="dg-note" style="text-align:left;margin-top:8px">React matches by identity. The input inside C keeps C's state.</p>
    </div>
    <div class="dg-panel">
      <span class="dg-cap">key={index}</span>
      ${chips(chip('slot 0 · A', 'ok'), chip('slot 1 · B→C', 'bad'), chip('slot 2 · C→D', 'bad'))}
      <p class="dg-note" style="text-align:left;margin-top:8px">Same positions, new contents. React reuses the node and rewrites it; state stays in the wrong row.</p>
    </div>
  </div>
  ${note('The key is not for the loop. It is the identity React uses to match an element in one render with the same element in the next.')}
`;

const cart = () =>
  stage(
    box('cart', '[ { mug, qty 2 }, { headphones, qty 1 } ]', 'a'),
    arrow('reduce((sum, item) => sum + price × qty, 0)'),
    box('total', '$137', 'ok'),
    note('Nothing stores the total. It is computed on every render. Add an item and the number follows because the array changed.'),
    split(
      codeBlock(`// update an existing line
setCart(cart.map((item) =>
  item.id === product.id
    ? { ...item, qty: item.qty + 1 }
    : item,
));`),
      codeBlock(`// add a new line
setCart([
  ...cart,
  { ...product, qty: 1 },
]);`),
      'same id',
      'new id',
    ),
  );

const props = () => {
  const stack = `<div class="comp-stack">${[1, 2, 3]
    .map((n) => comp('&lt;ProductCard /&gt;', `product={p${n}}`, '', 'component comp-card'))
    .join('')}</div>`;

  return `
    ${comp(
      '&lt;App /&gt;',
      'owns the cart state',
      comp('&lt;Header /&gt;', 'count = 2') +
        comp('&lt;ShopPage /&gt;', 'onAdd = addToCart', stack) +
        comp('&lt;CartPage /&gt;', 'cart, total'),
      'component',
    )}
    ${note('Props go down; events call back up. ShopPage contains one ProductCard per product.')}
  `;
};

const mount = () =>
  split(
    stage(
      box('page = "shop"', 'one piece of state'),
      row(box('ShopPage', 'mounted', 'ok'), box('CartPage', 'not rendered', 'dim')),
      note('ShopPage mounts: its state and effects start here.'),
    ),
    stage(
      box('page = "cart"', 'the same state, another value'),
      row(box('ShopPage', 'unmounted', 'dim'), box('CartPage', 'mounted', 'ok')),
      note('Mounting is not hiding. The other subtree is gone, and its state with it.'),
    ),
    'shop',
    'cart',
  );

const effects = () => `
  <div class="fig-timeline">
    ${phase('mount', stepChip('render'), stepChip('commit'), stepChip('effect', 'ok'))}
    ${phase('query changes', stepChip('render'), stepChip('commit'), stepChip('cleanup old', 'warn'), stepChip('effect new', 'ok'))}
    ${phase('unmount', stepChip('cleanup', 'warn'))}
  </div>
  ${note('The cleanup belongs to the previous effect. It runs before the next effect, and once more when the component leaves the page.')}
`;

const race = (abort = false) => `
  ${bars([
    { label: 'q = "m"', left: 0, width: abort ? 17 : 92, text: abort ? 'aborted at 0.5s' : 'slow — 2.8s', cls: abort ? 'dead' : '' },
    { label: 'q = "mu"', left: 17, width: 33, text: 'fast — 1.0s', cls: 'b' },
  ])}
  <div class="dg-row" style="margin-top:10px">
    ${box('screen at 1.5s', 'results for "mu"', 'ok')}
    ${box(abort ? 'screen at 2.8s' : 'screen at 2.8s', abort ? 'still "mu" — the loser was cancelled' : '"m" overwrites it — stale', abort ? 'ok' : 'bad')}
  </div>
  ${note(
    abort
      ? 'The cleanup aborts the old request. Its response can never call setState, so the wrong answer cannot land.'
      : 'Two requests, no ordering. The slow answer arrives last and wins, even though the box says "mu".',
  )}
`;

const service = () =>
  stage(
    box('ShopPage', 'renders the screen; no URL', 'ok'),
    arrow('useProducts(query)'),
    box('hooks/useProducts', 'loading, error, abort', 'a'),
    arrow('getProducts(query, signal)'),
    box('services/api.js', 'the only fetch and the only URL', 'hot'),
    arrow('GET /api/products?q=mug'),
    box('json-server :8000', 'knows nothing about React', 'dim'),
    note('The page asks for data. The hook knows how to wait. The service knows where the data lives. One job per file.'),
  );

const hookSlots = () => `
  <div class="dg-split">
    <div class="dg-panel">
      <span class="dg-cap">same order, every render — fixed</span>
      ${chips(chip('slot 0 · useState(name)'), chip('slot 1 · useState(age)'), chip('slot 2 · useEffect'))}
      <p class="dg-note" style="text-align:left;margin-top:8px">React counts calls. Slot 0 is always the name, slot 1 always the age.</p>
    </div>
    <div class="dg-panel">
      <span class="dg-cap">conditional hook — broken</span>
      ${chips(chip('render 1 · [age]', 'ok'), chip('render 2 · [name, age]', 'bad'))}
      <p class="dg-note" style="text-align:left;margin-top:8px">Age now reads the slot that used to be name. Hooks are positional, not named.</p>
    </div>
  </div>
  ${note('Call hooks at the top level of the component, in the same order, every time. That is the whole rule.')}
`;

const context = () =>
  stage(
    box('CartProvider', 'cart, addToCart, count, total', 'hot'),
    arrow('the value is published once'),
    row(
      box('Header', 'useCart() → count', 'a'),
      box('ShopPage', 'useCart() → addToCart', 'a'),
      box('CartPage', 'useCart() → cart, total', 'a'),
    ),
    note('The provider is still above the readers. The data still flows one way. The components in between stop carrying it.'),
  );

const folders = () => `
  <div class="fig-tree">
    <b>src/</b>
    <span>├── App.jsx <em>provider + routes</em></span>
    <span>├── main.jsx <em>React, the router, the root div</em></span>
    <span>├── index.css</span>
    <span>├── pages/ <em>one file per URL</em></span>
    <span>│   ├── ShopPage.jsx</span>
    <span>│   └── CartPage.jsx</span>
    <span>├── components/ <em>render and emit, no fetching</em></span>
    <span>│   ├── Header.jsx</span>
    <span>│   └── ProductCard.jsx</span>
    <span>├── hooks/ <em>loading, error, cleanup</em></span>
    <span>│   └── useProducts.js</span>
    <span>├── services/ <em>the only URL</em></span>
    <span>│   └── api.js</span>
    <span>└── context/ <em>one value, many readers</em></span>
    <span>    └── CartContext.jsx</span>
  </div>
  ${note('A file’s folder answers what it may import before anyone opens it. This step only moves files; the code does not change.')}
`;

const route = () =>
  stage(
    box('window.location', '/cart', 'a'),
    arrow('BrowserRouter reads the URL'),
    box('Routes', 'picks the matching <Route>'),
    arrow('/cart matches'),
    box('CartPage', 'the element for this URL', 'ok'),
    note('Refresh works. The back button works. A link can be shared. The URL is state that lives outside React.'),
  );


/* ── component wrapping tree ─────────────────────────── */

const comp = (name, sub = '', children = '', cls = 'component') =>
  `<div class="comp-box ${cls}"><b>${name}</b>${sub ? `<small>${sub}</small>` : ''}${
    children ? `<div class="comp-children">${children}</div>` : ''
  }</div>`;

const elBox = (name, children = '') => comp(name, 'element', children, 'element');

const componentTree = (kind = 'one') => {
  const card = (title = 'Aero Mug') =>
    elBox(
      '&lt;div className="card"&gt;',
      elBox('&lt;h2&gt;', title) +
        elBox('&lt;p&gt;', 'Kitchen') +
        elBox('&lt;p&gt;', '$24') +
        elBox('&lt;button&gt;', 'Add to cart'),
    );

  if (kind === 'one') {
    return `
      ${comp('&lt;App /&gt;', 'one component', elBox('&lt;h1&gt;', 'Shop') + card(), 'component')}
      ${note('A component is a box you name. The boxes inside it are its children. The tree is the UI.')}
    `;
  }

  if (kind === 'three') {
    return `
      ${comp('&lt;App /&gt;', 'still one component', card('Aero Mug') + card('Halo Headphones') + card('Fern Pot'), 'component')}
      ${note('Three identical boxes, copied by hand. The repetition is the signal that the box needs a name.')}
    `;
  }

  if (kind === 'product') {
    const product = (name) =>
      comp(
        '&lt;ProductCard /&gt;',
        `product={${name}}`,
        elBox('&lt;h2&gt;', name) + elBox('&lt;p&gt;', 'category') + elBox('&lt;button&gt;', 'Add'),
        'component',
      );
    return `
      ${comp('&lt;App /&gt;', 'owns the products array', product('p1') + product('p2') + product('p3'), 'component')}
      ${note('The repeated box now has a name. App still owns the data; each card receives one product as a prop.')}
    `;
  }

  const stack = `<div class="comp-stack">${[1, 2, 3]
    .map((n) => comp('&lt;ProductCard /&gt;', `product={p${n}}`, '', 'component comp-card'))
    .join('')}</div>`;

  return `
    ${comp(
      '&lt;App /&gt;',
      'owns page and cart',
      comp('&lt;Header /&gt;', 'count', '', 'component') +
        comp('&lt;ShopPage /&gt;', 'onAdd', stack, 'component') +
        comp('&lt;CartPage /&gt;', 'cart, total', '', 'component'),
      'component',
    )}
    ${note('The tree grows by wrapping, not by adding a second big file. ShopPage holds the same ProductCard three times — one card per product.')}
  `;
};

export const FIGURES = {
  pipeline, element, keys, cart, props, mount, effects, race, service,
  hookSlots, context, folders, route, componentTree,
};


/* the top diagram for these steps is the richer figure */
Object.assign(DIAGRAMS, {
  0: () => FIGURES.pipeline(),
  1: () => FIGURES.element(),
  3: () => FIGURES.keys(),
  6: () => FIGURES.cart(),
  7: () => FIGURES.props(),
  8: () => FIGURES.mount(),
  9: () => FIGURES.effects(),
  10: () => FIGURES.race(false),
  11: () => FIGURES.race(true),
  12: () => FIGURES.service(),
  13: () => FIGURES.hookSlots(),
  14: () => FIGURES.context(),
  15: () => FIGURES.folders(),
  16: () => FIGURES.route(),
});
