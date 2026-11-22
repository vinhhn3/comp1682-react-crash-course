/* Rich material for every React step. Rendered under the step diagram, so the
   explanation, the visual model and the demo are in one place. */

export const LESSONS = {
  0: [
    {
      type: 'p',
      html: 'React has two jobs: call your components to get a description of the UI, then make the real DOM match that description. <code>index.html</code> only supplies the empty <code>#root</code>; every visible node is created after that.',
    },
    {
      type: 'table',
      head: ['Layer', 'What it does', 'Where it lives'],
      rows: [
        ['your component', 'returns an element tree from data', '<code>App.jsx</code>'],
        ['React', 'renders and reconciles that tree', 'inside the library'],
        ['ReactDOM', 'commits the result to the real DOM', '<code>main.jsx</code>'],
        ['the browser', 'paints the changed nodes', 'outside React'],
      ],
    },
    {
      type: 'note',
      html: 'There is no HTML for the heading in the file. <code>createRoot(...).render(&lt;App /&gt;)</code> is the moment the page gets its first element.',
    },
  ],

  1: [
    {
      type: 'p',
      html: 'JSX looks like HTML, but the compiler turns it into a function call. The call returns a plain object — an element — not a DOM node. React decides when that object becomes a node.',
    },
    { type: 'figure', key: 'componentTree' , variant: 'one' },
    {
      type: 'table',
      head: ['You write', 'The compiler makes', 'React eventually makes'],
      rows: [
        ['<code>&lt;h1 className="title"&gt;Shop&lt;/h1&gt;</code>', '<code>React.createElement("h1", …)</code>', '<code>&lt;h1 class="title"&gt;</code>'],
        ['<code>{price}</code>', 'a child expression in the props', 'the text inside the node'],
        ['<code>className</code>', 'the <code>className</code> prop', 'the <code>class</code> attribute'],
      ],
    },
    {
      type: 'note',
      html: 'Curly braces are the way out of markup and into JavaScript. Everything inside them is evaluated before the element is created.',
    },
  ],

  2: [
    {
      type: 'p',
      html: 'Three cards, three copies of the same block. Only the words differ. That is not a React problem yet; it is a data problem: the data is not driving the markup.',
    },
    { type: 'figure', key: 'componentTree', variant: 'three' },
    {
      type: 'table',
      head: ['Identical in every card', 'Different in every card'],
      rows: [
        ['the wrapper, the heading levels, the button', 'the title'],
        ['the layout and the CSS classes', 'the category'],
        ['the event handler', 'the price'],
      ],
    },
    {
      type: 'note',
      html: 'A fourth product means a fourth copy. At one hundred products the file is unmaintainable. The next step turns the repeated block into a function of the data.',
    },
  ],

  3: [
    {
      type: 'p',
      html: 'An array and <code>map</code> turn data into elements. <code>key</code> is how React recognises the same element across renders: identity, not position.',
    },
    { type: 'widget', widget: 'keys' },
    {
      type: 'table',
      head: ['Key choice', 'Delete the middle item', 'Reorder'],
      rows: [
        ['<code>product.id</code>', 'React removes that node and keeps the others', 'nodes move with their data'],
        ['the array index', 'React rewrites the middle node with the next item', 'every row after the move looks changed'],
      ],
    },
    {
      type: 'note',
      html: 'A wrong key does not usually crash. It silently keeps the wrong local state — an open input, a checked box, a scroll position — attached to the wrong row.',
    },
  ],

  4: [
    {
      type: 'p',
      html: 'A component is a function whose input is <code>props</code> and whose output is an element tree. The parent owns the data; the child receives a read-only copy and reports events upward.',
    },
    { type: 'widget', widget: 'propsFlow' },
    { type: 'figure', key: 'componentTree', variant: 'product' },
    {
      type: 'table',
      head: ['Who', 'Owns', 'May do'],
      rows: [
        ['the parent', 'the data and the event handler', 'pass values and functions down'],
        ['the child', 'nothing about the data source', 'read props, call the callback'],
        ['the DOM', 'nothing', 'receive the committed result'],
      ],
    },
    {
      type: 'note',
      html: 'Props are read-only. A child that assigns to <code>props.product</code> is editing the parent’s data through the back door. If a child needs to change something, the parent passes a function.',
    },
  ],

  5: [
    {
      type: 'p',
      html: 'State is not a variable that changes in place. <code>useState</code> gives one render a constant value and a setter. Calling the setter asks React for another render with a new constant.',
    },
    { type: 'widget', widget: 'snapshot' },
    {
      type: 'table',
      head: ['Update', 'What it reads', 'Result of two calls'],
      rows: [
        ['<code>setCount(count + 1)</code>', 'the value captured by this render', '+1: both calls read the same snapshot'],
        ['<code>setCount(c =&gt; c + 1)</code>', 'the latest pending value', '+2: the queue applies them in order'],
      ],
    },
    {
      type: 'note',
      html: 'React batches the updates from one event into one render. That is why two setters do not produce two renders. The log in the simulator is the truth, not the mental model of a live variable.',
    },
  ],

  6: [
    {
      type: 'p',
      html: 'The cart is an array in state. Adding a line means creating a new array, not mutating the old one. The total is derived from the array on every render; it is never stored beside it.',
    },
    {
      type: 'table',
      head: ['Value', 'Stored?', 'Why'],
      rows: [
        ['<code>cart</code>', 'yes, in state', 'it must survive a render'],
        ['<code>total</code>', 'no', 'it is a function of the cart'],
        ['<code>count</code>', 'no', 'it is a function of the cart'],
      ],
    },
    {
      type: 'note',
      html: 'A second copy of derived data is a second thing to keep in sync. If it can be computed from state, compute it during render.',
    },
  ],

  7: [
    {
      type: 'p',
      html: 'Two components need the count, so the state moves to the closest common owner: <code>App</code>. The header receives it as a prop. The state did not become global; it moved up one level.',
    },
    {
      type: 'flow',
      hops: [
        { at: 'App', data: 'cart state lives here', note: 'the only writer' },
        { at: 'Header', data: 'count = cart.length', note: 'reads, never writes' },
        { at: 'ShopPage', data: 'onAdd = addToCart', note: 'reports an event upward' },
        { at: 'CartPage', data: 'cart, total', note: 'reads the same owner' },
      ],
    },
    {
      type: 'note',
      html: 'This is prop drilling: every component between the owner and the reader has to carry the value. It is fine for one level. When it reaches four levels in different branches, context is the next tool (step 14).',
    },
  ],

  8: [
    {
      type: 'p',
      html: 'Page switching is conditional rendering: one piece of state chooses which subtree exists. The other subtree is not hidden; it is unmounted, and its local state disappears with it.',
    },
    {
      type: 'table',
      head: ['<code>page</code>', 'Mounted', 'Gone'],
      rows: [
        ['<code>"shop"</code>', '<code>ShopPage</code>', '<code>CartPage</code>'],
        ['<code>"cart"</code>', '<code>CartPage</code>', '<code>ShopPage</code>'],
      ],
    },
    {
      type: 'note',
      html: 'Refresh the page: the state resets to <code>"shop"</code>, and the browser back button does nothing. The URL does not know about the page yet. Step 16 fixes that.',
    },
  ],

  9: [
    {
      type: 'p',
      html: 'An effect runs after the commit, not during render. The dependency array is the contract: React compares it with the previous render and decides whether to run the effect and its cleanup.',
    },
    { type: 'widget', widget: 'layers', scenario: 'success', note: 'The folders are the destination: step 15 moves the flat files into them without changing the code.' },
    { type: 'widget', widget: 'effects' },
    {
      type: 'table',
      head: ['Dependency array', 'Runs', 'Cleanup runs'],
      rows: [
        ['no array', 'after every render', 'before every re-run'],
        ['<code>[query]</code>', 'on mount and when query changes', 'before the next run, and on unmount'],
        ['<code>[]</code>', 'once on mount', 'on unmount'],
      ],
    },
    {
      type: 'table',
      head: ['What the screen must show', 'State', 'Why'],
      rows: [
        ['a spinner and a disabled button', '<code>loading</code>', 'silence looks broken'],
        ['“No products match”', '<code>data.length === 0</code>', 'empty is not an error'],
        ['“Something went wrong” + retry', '<code>error</code>', 'the request failed, the app did not'],
        ['the list', '<code>data</code>', 'the only success branch'],
      ],
    },
    {
      type: 'note',
      html: 'In development, StrictMode mounts, unmounts and mounts again. You will see the effect and cleanup twice. That is deliberate: it catches a missing cleanup. Production runs it once.',
    },
  ],

  10: [
    {
      type: 'p',
      html: 'The search box is a controlled input: its value is state, and every keystroke writes that state. The query is in the effect’s dependencies, so every keystroke starts a request.',
    },
    {
      type: 'table',
      head: ['Input', 'Where the value lives', 'Trade-off'],
      rows: [
        ['controlled', 'React state', 'every keystroke re-renders; one source of truth'],
        ['uncontrolled', 'the DOM', 'fewer renders; harder to derive UI from the value'],
      ],
    },
    {
      type: 'note',
      html: 'Two requests leave. There is no guarantee about the order the answers arrive in. The last answer to arrive wins, even when it belongs to the older query.',
    },
  ],

  11: [
    {
      type: 'p',
      html: 'The effect returns a cleanup. React runs it before the next effect and once on unmount. The cleanup aborts the request that the previous effect started, so its answer can never call <code>setState</code>.',
    },
    { type: 'widget', widget: 'layers', scenario: 'abort', note: 'The folders are the destination: step 15 moves the flat files into them without changing the code.' },
    { type: 'widget', widget: 'race' },
    {
      type: 'table',
      head: ['Moment', 'What runs'],
      rows: [
        ['first mount', 'effect starts request A'],
        ['query changes', 'cleanup aborts A, then effect starts B'],
        ['B answers', '<code>setProducts(B)</code>'],
        ['unmount', 'cleanup aborts the current request'],
      ],
    },
    {
      type: 'note',
      html: 'Ignore <code>AbortError</code>: the user caused it by typing, so it is not an error screen. A stale closure is a different bug: an effect with <code>[]</code> captured the first render’s variables forever.',
    },
  ],

  12: [
    {
      type: 'p',
      html: 'Move the URL and the <code>fetch</code> into one function. The page asks for products by name; the hook owns loading and errors; the service is the only file that knows where the backend is.',
    },
    { type: 'widget', widget: 'layers', scenario: 'success', note: 'The folders are the destination: step 15 moves the flat files into them without changing the code.' },
    {
      type: 'table',
      head: ['File', 'Knows', 'Must not know'],
      rows: [
        ['<code>pages/ShopPage.jsx</code>', 'what the screen shows', 'URLs, status codes, aborts'],
        ['<code>hooks/useProducts.js</code>', 'loading, error, cleanup', 'JSX, the shape of a card'],
        ['<code>services/api.js</code>', 'the URL and <code>fetch</code>', 'React, hooks, components'],
      ],
    },
    {
      type: 'note',
      html: 'Run <code>grep -rn "/api" src</code>. One hit. Run <code>grep -rn "fetch" src</code>. One hit. Changing the backend is changing one line in one file.',
    },
  ],

  13: [
    {
      type: 'p',
      html: 'A custom hook is a function that calls other hooks and returns the behaviour. It is not a new React feature; it is a name for “state + effect + cleanup” that a page can reuse without knowing how it works.',
    },
    {
      type: 'table',
      head: ['Before — <code>ShopPage</code>', 'After — <code>useProducts</code>'],
      rows: [
        ['three <code>useState</code> calls', 'the same three, inside the hook'],
        ['one <code>useEffect</code> with abort', 'the same effect, inside the hook'],
        ['fetch, loading, error in the page', 'the page asks for <code>{ products, loading, error }</code>'],
      ],
    },
    {
      type: 'note',
      html: 'Hooks are positional. React does not look at names; it counts calls. A hook inside an <code>if</code> shifts every slot after it, and the values land in the wrong state.',
    },
  ],

  14: [
    {
      type: 'p',
      html: 'The cart is needed by the header and the cart page, in different branches of the tree. Context puts one owner above both, and the readers ask for the value instead of receiving it through every parent.',
    },
    { type: 'widget', widget: 'layers', scenario: 'context', note: 'The folders are the destination: step 15 moves the flat files into them without changing the code.' },
    { type: 'widget', widget: 'contextWrap' },
    { type: 'widget', widget: 'context' },
    {
      type: 'compare',
      left: {
        label: 'before — props',
        text: `App owns cart
├── Header      count
├── ShopPage    onAdd
└── CartPage    cart, total

four props whose only job
is to move the cart around`,
      },
      right: {
        label: 'after — context',
        text: `CartProvider owns cart
├── Header      useCart() → count
├── ShopPage    useCart() → addToCart
└── CartPage    useCart() → cart, total

App is back to navigation only`,
      },
    },
    {
      type: 'table',
      head: ['Good fit', 'Not a fit'],
      rows: [
        ['one value read in different branches', 'a value only one page uses — local state'],
        ['the signed-in user, the cart, theme', 'a value one child needs — a prop'],
        ['few writers, several distant readers', '“everything in one provider”'],
      ],
    },
    {
      type: 'note',
      html: 'Do not sell context as a performance tool. Every consumer re-renders on every change, and there is no selector to opt out. Here it buys fewer props and an <code>App</code> that no longer knows what a cart is.',
    },
  ],

  15: [
    {
      type: 'p',
      html: 'Same code, different address. The folders did not change behaviour; they made the dependency direction visible. A page may use components, hooks and context; a component never fetches; only a service knows a URL.',
    },
    {
      type: 'table',
      head: ['Folder', 'May import', 'Must not import'],
      rows: [
        ['<code>pages/</code>', 'components, hooks, context', 'a URL, <code>fetch</code>'],
        ['<code>components/</code>', 'context, other components', 'services, hooks that fetch'],
        ['<code>hooks/</code>', 'services', 'components, pages'],
        ['<code>services/</code>', 'nothing from the app', 'React, a component'],
        ['<code>context/</code>', 'React only', 'a service, a page'],
      ],
    },
    {
      type: 'table',
      head: ['The thing', 'The home'],
      rows: [
        ['a card shown on several screens', '<code>components/</code>'],
        ['the <code>/cart</code> screen', '<code>pages/CartPage.jsx</code>'],
        ['<code>fetch("/api/products")</code>', '<code>services/api.js</code>'],
        ['loading + error + abort', '<code>hooks/useProducts.js</code>'],
        ['the cart, read by header and page', '<code>context/CartContext.jsx</code>'],
      ],
    },
    {
      type: 'note',
      html: 'The folder tree is the architecture diagram with file names. If you cannot decide where a file goes, the answer is usually “which layer is allowed to know this?”.',
    },
  ],

  16: [
    {
      type: 'p',
      html: 'The URL is state that lives outside React. The router reads it and chooses which page to render. Refresh works, the back button works, and a link can be shared.',
    },
    { type: 'widget', widget: 'routerWrap' },
    {
      type: 'table',
      head: ['Before — page state', 'After — URL'],
      rows: [
        ['refresh resets to the shop', 'refresh keeps <code>/cart</code>'],
        ['the back button leaves the app', 'the back button changes the page'],
        ['“click Cart” is the only way to share', 'send <code>/cart</code>'],
      ],
    },
    {
      type: 'figure',
      key: 'folders',
    },
    {
      type: 'h',
      text: 'The request through the layers, one last time',
    },
    {
      type: 'widget',
      widget: 'layers',
      scenario: 'success',
    },
    {
      type: 'flow',
      hops: [
        { at: 'click', data: 'setCount(1) + setCart([...])', note: 'React batches them' },
        { at: 'render', data: 'App → pages → components', note: 'new constants, new elements' },
        { at: 'reconcile', data: 'old tree vs new tree', note: 'keys match the list items' },
        { at: 'commit', data: 'the minimal DOM updates', note: 'the page changes' },
        { at: 'effect', data: 'only if the deps changed', note: 'cleanup first, then the new effect' },
      ],
      note: 'That is the life of one render, end to end. The rest of the course is the detail behind each box.',
    },
  ],
};
