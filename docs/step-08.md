# Step 08 — router (final)

**Branch:** `08-router` · `main` points here.

## What changed

```
src/
├── config/routes.js              ← every path, once
├── router/AppRouter.jsx          ← URL → page
├── pages/ProductDetailPage.jsx   ← new
├── hooks/useProduct.js           ← one resource, same contract as useProducts
├── components/layout/Header.jsx  ← NavLink, no props
└── App.jsx                       ← no `page` state
```

## What to look at

1. **`App.jsx`** is nine lines. There is no navigation state left.
2. **`config/routes.js`** — links and routes read the same object. `productPattern` for the route, `product(id)` for the link.
3. **`useProduct`** — same contract as `useProducts`: `{ data, loading, error, reload }`. The shape is the convention.
4. **`useParams`** — the id comes from the URL, not from a prop.
5. **`Header`** — `NavLink` computes the active class from the URL. Another prop died.

## Demo beats

**The URL bar.** Click a product: `/products/p4`. Hit the browser back button. Then reload the page — it still works, because the URL is the state.

**Compare with step 07.** `git diff 07 08 -- src/App.jsx`: a `useState`, a ternary and a prop disappear.

**The 404 route.** Visit `/nope`. `Routes` falls through to `*`.

**The a11y detail.** In `ProductCard`, the title is a link and the Add button is a sibling. Ask: "what happens if you put a `<button>` inside an `<a>`?" Then show what the browser does.

## What to say

> "Two hours ago we hand-rolled navigation with a `useState`. It worked. It also broke the back button, the refresh, and every link you would ever want to send someone. Router is not a feature — it is putting the page in the URL where it belongs."

## Exercise

Add `/about` with a static page, then a link to it in the header. You should touch three files: `routes.js`, `AppRouter.jsx`, a new page — and nothing else.

## What is deliberately missing

- No tests. That is a whole course.
- No authentication or protected routes.
- No data caching (TanStack Query). `useProducts` is the hand-rolled version.
- No TypeScript. The `types/` folder is the boundary you would type.
