# Step 05 — the service layer

**Branch:** `05-http-service`

## What changed

```
src/
├── config/env.js               ← base URL, mock switch
├── config/constants.js         ← shipping, coupon, magic numbers
├── lib/formatCurrency.js       ← pure function, no React
├── types/product.js            ← DTO → model mapper
├── services/http.js            ← the only thing that knows what a request is
└── services/productService.js  ← one function per endpoint
```

And in the components: `price_cents` became `price`, and every `$` formatting call
became `formatCurrency(...)`.

## The diff worth showing

```bash
git diff 04 05 -- src/pages/ProductsPage.jsx
```

```diff
-  mockApi.handle('GET', `/products?q=${encodeURIComponent(query)}`)
+  productService.getAll({ query })
```

Two lines out, one in. Same behaviour.

Then `git diff 04 05 --stat` — eight files changed, and the component got shorter.

## What to look at

1. **`http.js`** — read it top to bottom. Base URL, chaos, `HttpError`, the mock switch. Point at the `USE_MOCK` branch: *"this is the only line in the app that knows a backend exists."*
2. **`productService.js`** — three methods, three paths. No React.
3. **`types/product.js`** — see the comment. This is the file that stops the server's vocabulary leaking into the UI.
4. **`formatCurrency`** — five copies became one.
5. **`constants.js`** — `FREE_SHIPPING_OVER` used to be `5000` inside the summary.

## Demo beats

**Break it with a query param.**

| URL | What the room sees | What to say |
|---|---|---|
| `/?chaos=slow=2` | spinner for two seconds | "loading is a state, not a moment" |
| `/?chaos=fail` | the error card | "the service threw, the page caught" |
| `/?chaos=offline` | "Failed to fetch" | "different failure, different words" |

**The console.** With DevTools open, every request prints `→ GET /products` and `← ...`. Say: *"one place logs. That is what a layer buys you."*

**The mapping.** Open `types/product.js` beside a network response. `price_cents: 2400` on the left, `price: 24` in the component. Say: *"the component never sees cents. When the backend changes, this is the only file that changes."*

## What is still wrong

The effect is still in the page: three `useState`s, no abort, the race is alive.
Run it again — `?chaos=slow=2`, type `mu` fast. Still broken. That is step 06.

## Exercise

Add `productService.getCategories()`. It should go through `http.get('/products')` and map, not call `mockApi`. Nothing in `components/` should change.
