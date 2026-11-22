# Step 06 — the custom hook

**Branch:** `06-custom-hook`

## What changed

```
src/
├── hooks/useProducts.js        ← debounce, fetch, abort, error, retry
├── hooks/useDebounce.js
├── lib/devlog.js               ← the event bus behind the DevPanel
├── components/common/DevPanel.jsx
├── components/common/ErrorCard.jsx
└── pages/ProductsPage.jsx      ← now four lines of data logic
```

## The diff worth showing

```bash
git diff 05 06 -- src/pages/ProductsPage.jsx
```

Forty lines out, one in:

```diff
- const [products, setProducts] = useState([]);
- const [loading, setLoading] = useState(true);
- const [error, setError] = useState(null);
- useEffect(() => { ... }, [query]);
+ const { data, loading, error, reload, searchTerm } = useProducts(query);
```

Same behaviour. Different address.

## What to look at

1. **`useProducts`** — read the cleanup out loud:
   ```js
   return () => { alive = false; controller.abort(); };
   ```
   React runs the previous cleanup *before* the next effect. That ordering is the whole fix.
2. **`useDebounce`** — nine lines, and it removes 80% of the traffic.
3. **The return shape** — `{ data, loading, error, reload }`. A hook is a function with a contract, not magic.
4. **`DevPanel`** — `?debug=1`. One `logEvent` per layer.

## Demo beats

**The race, fixed.** `?chaos=slow=2`, type `mu` fast. Two requests go out; the first is aborted at the moment the second starts. The list is right. Say: *"one line. That was the bug that ships."*

**The Network tab.** Open it, type in search. Watch the first request show `(canceled)`. That is `AbortController` visible.

**StrictMode.** The console shows two requests on mount. Ask why. Answer: React mounts, unmounts, mounts in dev to catch missing cleanups. Your abort makes the first harmless — that is the point.

**The DevPanel.** `?debug=1`, click Add. Show the trace:
```
state   App.addToCart   p-12
```
Say: *"that is the write chain, on screen. At 2:35 we turn this into layers."*

## What to say

> "A hook is not a React feature. It is a function that happens to call other hooks. `useProducts` is just the fourty lines we deleted, with a name and a contract."

## Exercise

Write `useLocalStorage(key, initial)` and use it for the coupon code, so the discount survives a refresh. It must not throw when the stored value is corrupt.
