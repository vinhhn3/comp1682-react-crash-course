# React crash course — handout

Everything from the session, on one page. Keep it open next to your project.

```bash
npm install
git checkout 08-router     # or any step
npm run dev
```

| URL | What it shows |
|---|---|
| `/?debug=1` | DevPanel: live state + last events |
| `/?chaos=slow=2` | 2 seconds of latency |
| `/?chaos=fail` | server returns 500 |
| `/?chaos=offline` | network is down |

---

## 1. The layer map

```
pages/          route screens. compose, own page state
  ↓
components/     render + emit. common/ layout/ cart/ product/
  ↓
hooks/          behaviour: loading, error, retry, derived values
  ↓
services/       HTTP only. URLs, headers, status, DTO → model
  ↓
lib/ config/ types/      pure. formatters, constants, shapes
```

**Three rules that hold the whole thing together**

1. **Only hooks touch services.** A component never sees a URL. A service never sees JSX.
2. **Dependencies point down.** If you need an arrow pointing up, the logic is in the wrong layer.
3. **Each layer has one job.** A service's job is "talk HTTP and map the response." If it also decides when to show a spinner, it has two jobs.

---

## 2. Where does this file go?

| The thing | The home |
|---|---|
| Button used on four pages | `components/common/` |
| The header and page shell | `components/layout/` |
| Anything only products use | `components/product/` |
| The `/cart` screen | `pages/CartPage.jsx` |
| `fetch('/products')` | `services/productService.js` |
| The raw request + chaos + logging | `services/http.js` |
| "loading while fetching, retry on error" | `hooks/useProducts.js` |
| `$24.00` from `2400` | `lib/formatCurrency.js` |
| API base URL, page size | `config/env.js`, `config/constants.js` |
| `/products/:id` as a string | `config/routes.js` |
| The shape of a product | `types/product.js` |
| Cart visible in the header **and** three pages | `context/CartContext.jsx` |

Rule of thumb: **if two unrelated screens need it, it is either a hook or context. If it has no React in it, it belongs in `lib` or `services`.**

---

## 3. Read chain

```
ProductsPage       useProducts(query)
  → useProducts    loading = true                     spinner renders
  → productService getAll({ query, signal })
  → http           GET /products?q=…                  network
  → types          mapProduct(dto)  price_cents → price
  → useProducts    setData(models); loading = false
  → ProductsPage   re-render → <ProductList products={data} />
```

Every "it shows nothing" bug lives on this line. Walk it downward and print at each step.

## 4. Write chain

```
ProductCard    onClick={() => onAdd(product)}
  → useCart    add(id)          logEvent('hook', …)
  → cartService add(id)         POST /cart  → whole cart back
  → context    value changes    header badge re-renders
```

Every "the button does nothing" bug lives here. Walk it upward: is the handler wired? does the hook update state? does the service resolve?

---

## 5. Import matrix

```
from ↓        pages  comp  hooks  ctx  svc  lib  cfg  types
pages           ·     ✓     ✓     ✓    ✕    ✓    ✓    ✓
components      ✕     ✓     ✓     ✕    ✕    ✓    ✓    ✓
hooks           ✕     ✕     ✓     ✓    ✓    ✓    ✓    ✓
context         ✕     ✕     ✓     ·    ✓    ✓    ✓    ✓
services        ✕     ✕     ✕     ✕    ·    ✓    ✓    ✓
lib / config    ✕     ✕     ✕     ✕    ✕    ·    ·    ✓
```

The two ✕s that matter most: **`services` never imports React**, and **`components` never imports `services`**.

---

## 6. Making it fail on purpose

| What you want to see | What to do |
|---|---|
| Spinner that never ends | `?chaos=slow=9` |
| Error card with retry | `?chaos=fail` |
| "No connection" state | `?chaos=offline` |
| The **stale response** race | `?chaos=slow=1`, type fast in search |
| The **index key** bug | in a list with inputs, change `key={item.id}` to `key={index}`, delete the middle row |

The race is fixed by `AbortController` in `hooks/useProducts.js`: the cleanup function aborts the request that the *previous* keystroke started.

---

## 7. Debug recipe (the one you will actually use)

1. Breakpoint in the handler (`onClick`, `onChange`, `onSubmit`).
2. Click. The browser freezes. Read the **call stack** — those frames are your layers.
3. `F11` steps *into* the next layer. `F10` steps *over* within a layer.
4. `F5` resumes. Watch which part of the UI changes.
5. React DevTools → **Highlight updates** if you want to see *what* re-rendered.

If the stack shows `ProductCard → ProductsPage → useCart → cartService`, the architecture is working. If it shows `ProductCard → fetch`, something is in the wrong layer.

---

## 8. The DevPanel

`?debug=1`. It exists to make the invisible visible:

```
state      { items: 3, loading: false, error: null }
last events
  hook      useCart.add        p-12
  service   cartService.add    POST /cart
  context   CartProvider       items: 3
```

Every event is one `logEvent(layer, name, detail)` call. Add your own when you are lost.

---

## 9. Quiz

Answer before scrolling. Answers at the bottom.

1. `formatCurrency` lives where?
2. `fetch('/orders')` lives where?
3. The spinner-and-retry logic lives where?
4. A `Button` used on every page lives where?
5. The cart, needed by the header and three pages, lives where?
6. The `/cart` route lives where?
7. Where does the API key go, and why not in the component?
8. A component needs a list of products. Should it call `productService`?
9. Why does the service layer map `price_cents` to `price`?
10. You add a feature and it needs a new file in four folders. What does that tell you?

<details>
<summary>Answers</summary>

1. `lib/` — pure function, no React, no network.
2. `services/` — one module per resource.
3. `hooks/` — that is behaviour, not rendering.
4. `components/common/` — reusable, no domain knowledge.
5. `context/` — cross-cutting state, or you prop-drill through four levels.
6. `pages/CartPage.jsx`, with the path string in `config/routes.js`.
7. `config/env.js`, read from `import.meta.env`. Anything shipped to the browser is public; a key in a component is a key in devtools.
8. No. It calls `useProducts()`; the hook calls the service.
9. So components never learn the server's vocabulary. Change the API shape and you edit one mapper.
10. That the feature is big enough that a feature folder would be tidier — layer-first has a ceiling.

</details>

---

## 10. Exercises, by branch

| Branch | Do this |
|---|---|
| `01-static-ui` | Add a "New" badge to the three newest products. No state. |
| `02-state` | Add "Add to cart" and make the count on the page change. |
| `03-forms-lifting` | Add a "Top rated" checkbox that filters the grid. Note it is derived, not stored. |
| `04-fetch-in-component` | `?chaos=slow=1`, type in search, get the stale answer. Write down why. |
| `05-http-service` | Add `productService.getCategories()`. Nothing else should change. |
| `06-custom-hook` | Write `useLocalStorage(key, initial)`. Use it for the coupon. |
| `07-context` | Delete every cart prop from `App`. If it still works, you won. |
| `08-router` | Add `/about`. Then add a `NotFound` page. |

---

## 11. Mistakes that will cost you marks

- `useEffect` with no dependency array → fetch on every render → infinite loop.
- Mutating state (`items.push(x)`) → nothing re-renders. Always a new array.
- `key={index}` on a list that can be reordered or deleted from.
- `fetch` inside a component → you now cannot test it, reuse it, or change the API in one place.
- Prop drilling five levels instead of one context.
- Business logic in `App.jsx` because "it was already there".
- Storing what you can compute (`total` as state next to `items`).
- Putting `async` directly in `useEffect` — the callback must return the cleanup, not a promise.

---

## 12. Next

- **Data fetching:** TanStack Query replaces hand-written `useProducts` (caching, retries, refetch). Read it after this course.
- **Server state vs client state:** the distinction that makes the above obvious.
- **TypeScript:** the `types/` folder is already the shape of it. Your mapping functions become the type boundary.
- **Testing:** start with `services/` — pure functions, no React, no DOM.
- **Feature folders:** the moment one feature's files span five folders and you keep losing them, switch.
