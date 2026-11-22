/* One entry per step. The concept page reads the current git branch and renders
   the matching entry, so `npm run step 5` changes the code AND the concept. */

export const STEPS = {
  0: {
    branch: 's00-start',
    title: 'One empty div',
    line: 'A React app is one HTML file with an empty div, and one function that returns markup.',
    changed: [
      'index.html has a single <div id="root">',
      'main.jsx mounts <App /> into it',
      'App returns an h1 — that is the whole app',
    ],
    code: {
      file: 'src/main.jsx',
      text: `ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
    },
    ask: 'Where is the HTML for this heading? Search the files for it.',
  },

  1: {
    branch: 's01-one-card',
    title: 'JSX',
    line: 'It looks like HTML, but it is JavaScript. Curly braces are the way out.',
    changed: [
      'App returns a heading and one card',
      'the card is hardcoded: name, category, price',
      'the button exists and does nothing',
    ],
    code: {
      file: 'src/App.jsx',
      text: `<div className="card">
  <h2>Aero Mug</h2>
  <p>Kitchen</p>
  <p>$24</p>
  <button>Add to cart</button>
</div>`,
    },
    ask: 'What are the curly braces for? We will need them in two minutes.',
  },

  2: {
    branch: 's02-three-cards',
    title: 'Copy, paste, change the words',
    line: 'Three products, three copies of the same block. This is the pain that a list fixes.',
    changed: [
      'the same six lines, three times',
      'only the text is different',
      'a fourth product means a fourth copy',
    ],
    code: {
      file: 'src/App.jsx',
      text: `<div className="card"> … Aero Mug … </div>
<div className="card"> … Halo Headphones … </div>
<div className="card"> … Fern Pot … </div>`,
    },
    ask: 'How would you add 100 products? How long is this file?',
  },

  3: {
    branch: 's03-map',
    title: 'An array and map',
    line: 'Data in, elements out. key tells React which element is which.',
    changed: [
      'products is an array of objects',
      'map returns one card per product',
      'key={product.id} — identity, not position',
    ],
    code: {
      file: 'src/App.jsx',
      text: `{products.map((product) => (
  <div className="card" key={product.id}>
    <h2>{product.title}</h2>
    <p>{product.category}</p>
    <p>\${product.price}</p>
  </div>
))}`,
    },
    ask: 'What happens if you use the index as the key and delete the middle row?',
  },

  4: {
    branch: 's04-component',
    title: 'A component with props',
    line: 'The card moved into its own file and takes the data as an argument.',
    changed: [
      'components/ProductCard.jsx',
      '({ product }) destructures the props',
      'the page passes product={product}',
    ],
    code: {
      file: 'src/ProductCard.jsx',
      text: `const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <h2>{product.title}</h2>
      ...
    </div>
  );
};`,
    },
    ask: 'Who owns the products array now? Who only displays it?',
  },

  5: {
    branch: 's05-state',
    title: 'State: the page remembers',
    line: 'useState gives the component a value it can change. Changing it re-renders.',
    changed: [
      'count lives in App, not in a plain variable',
      'addToCart calls setCount(count + 1)',
      'the button gets the function as a prop',
    ],
    code: {
      file: 'src/App.jsx',
      text: `const [count, setCount] = useState(0);

const addToCart = () => {
  setCount(count + 1);
};`,
    },
    ask: 'Press the button twice. Where does the number on screen come from?',
  },

  6: {
    branch: 's06-cart',
    title: 'The cart is an array',
    line: 'State can hold a list. The total is computed from it — never stored next to it.',
    changed: [
      'cart holds { ...product, qty }',
      'adding again increments with map',
      'total comes from reduce on every render',
    ],
    code: {
      file: 'src/App.jsx',
      text: `if (found) {
  setCart(cart.map((item) =>
    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
  ));
} else {
  setCart([...cart, { ...product, qty: 1 }]);
}

const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);`,
    },
    ask: 'Where is the total stored? Try to find the place where it is set.',
  },

  7: {
    branch: 's07-lift',
    title: 'The count travels down',
    line: 'Two places need it, so the state stays in App and arrives as a prop.',
    changed: [
      'components/Header.jsx appears',
      '<Header count={cart.length} />',
      'the header has no state of its own',
    ],
    code: {
      file: 'src/App.jsx',
      text: `return (
  <div className="app">
    <Header count={cart.length} />
    ...
  </div>
);`,
    },
    ask: 'If the header were five components deep, how many files would carry this number?',
  },

  8: {
    branch: 's08-pages',
    title: 'Two screens, one boolean',
    line: 'Conditional rendering is a ternary. Page switching is a piece of state.',
    changed: [
      "page is 'shop' or 'cart'",
      'ShopPage and CartPage are extracted',
      'the nav buttons change the state',
    ],
    code: {
      file: 'src/App.jsx',
      text: `const [page, setPage] = useState('shop');

{page === 'shop' ? <ShopPage /> : <CartPage />}`,
    },
    ask: 'Refresh the page. What happens? Then press the browser back button.',
  },

  9: {
    branch: 's09-fetch',
    title: 'useEffect and a real API',
    line: 'The effect runs after render. Fetch inside it, and draw three states.',
    changed: [
      'products comes from /api/products',
      'loading starts true and flips in finally',
      'error is its own state',
    ],
    code: {
      file: 'src/pages/ShopPage.jsx',
      text: `useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);`,
    },
    ask: 'What is on screen during the wait? What if the server is down?',
  },

  10: {
    branch: 's10-search',
    title: 'Every keystroke is a request',
    line: 'The query is state, and it sits in the dependency array. Type, and the list refetches.',
    changed: [
      'the search box is a controlled input',
      '[query] replaces []',
      'each keystroke starts a new request',
    ],
    code: {
      file: 'src/pages/ShopPage.jsx',
      text: `<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>

useEffect(() => { ... }, [query]);`,
    },
    ask: 'Type fast. Two requests leave. Which answer ends up on screen?',
  },

  11: {
    branch: 's11-abort',
    title: 'The cleanup cancels the loser',
    line: 'The effect returns a function. React runs it before the next effect, and on unmount.',
    changed: [
      'a new AbortController per effect run',
      'the signal is passed to fetch',
      'return () => controller.abort()',
    ],
    code: {
      file: 'src/hooks/useProducts.js',
      text: `const controller = new AbortController();

fetch(\`/api/products?q=\${query}\`, { signal: controller.signal });

return () => controller.abort();`,
    },
    ask: 'Which request is still alive when you stop typing?',
  },

  12: {
    branch: 's12-api',
    title: 'The URL appears once',
    line: 'One function owns the endpoint. Everything above it asks for products by name.',
    changed: [
      'services/api.js exists',
      'getProducts(query, signal)',
      'the hook imports it instead of fetching',
    ],
    code: {
      file: 'src/services/api.js',
      text: `export const getProducts = async (query, signal) => {
  const res = await fetch(\`/api/products?q=\${query}\`, { signal });
  return res.json();
};`,
    },
    ask: 'Run grep -rn "/api" src. How many places change if the backend moves?',
  },

  13: {
    branch: 's13-hook',
    title: 'A hook is a named behaviour',
    line: 'The effect moved out of the page. The page asks for products and forgets how.',
    changed: [
      'hooks/useProducts.js',
      'returns { products, loading, error }',
      'ShopPage lost twenty lines',
    ],
    code: {
      file: 'src/pages/ShopPage.jsx',
      text: `const { products, loading, error } = useProducts(query);`,
    },
    ask: 'What does ShopPage still know about the network?',
  },

  14: {
    branch: 's14-context',
    title: 'The cart moves into a provider',
    line: 'One owner, three readers, no props in between.',
    changed: [
      'context/CartContext.jsx',
      'App loses the cart state entirely',
      'Header, ShopPage, CartPage call useCart()',
    ],
    code: {
      file: 'src/context/CartContext.jsx',
      text: `export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  ...
  return (
    <CartContext.Provider value={{ cart, addToCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
};`,
    },
    ask: 'How many props did App lose? Count them before and after.',
  },

  15: {
    branch: 's15-folders',
    title: 'The folders appear last',
    line: 'Same code, different address. This is a move, not a rewrite.',
    changed: [
      'pages/ components/ hooks/ services/ context/',
      'git mv plus import paths',
      'nothing about the behaviour changed',
    ],
    code: {
      file: 'src/',
      text: `src/
├── pages/        ShopPage, CartPage
├── components/   Header, ProductCard
├── hooks/        useProducts
├── services/     api
├── context/      CartContext
└── App.jsx       provider + routes`,
    },
    ask: 'Where would a currency formatter go? Where does the router live?',
  },

  16: {
    branch: 's16-router',
    title: 'The URL owns the page',
    line: 'Refresh works. The back button works. A link can be shared.',
    changed: [
      'BrowserRouter in main.jsx',
      'Routes in App.jsx',
      'NavLink instead of buttons',
    ],
    code: {
      file: 'src/App.jsx',
      text: `<Routes>
  <Route path="/" element={<ShopPage />} />
  <Route path="/cart" element={<CartPage />} />
</Routes>`,
    },
    ask: 'Which is easier to send to a friend: /cart, or “click Cart”?',
  },
};

export const stepNumber = (branch) => {
  const match = branch.match(/^s(\d\d)-/);
  return match ? Number(match[1]) : null;
};
