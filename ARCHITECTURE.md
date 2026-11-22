# Architecture of the finished app

This is the last 20 minutes of the course, written down. The app is small on
purpose: you can see every file at once, so the structure is the lesson.

## The tree

```
src/
├── App.jsx              provider + router, nothing else
├── main.jsx             React, the browser router, the root div
├── index.css            plain CSS, no framework
│
├── pages/               one file per URL
│   ├── ShopPage.jsx     search + list
│   └── CartPage.jsx     cart lines + total
│
├── components/          UI that renders and emits, no fetching
│   ├── Header.jsx
│   └── ProductCard.jsx
│
├── hooks/               behaviour: loading, error, cleanup
│   └── useProducts.js
│
├── services/            the only place that knows a URL
│   └── api.js
│
└── context/             state that many screens need
    └── CartContext.jsx
```

## Who may import whom

```
pages/       →  components, hooks, context
components/  →  context  (never services, never fetch)
hooks/       →  services
services/    →  nothing from the app
context/     →  react only
```

Two rules cover all of it:

1. **Only `services/` knows a URL. Only `hooks/` calls `services/`.** A component
   never contains `fetch`.
2. **Dependencies point down.** `services/api.js` cannot import a component, a
   page, or a hook. If you need that, the logic is in the wrong file.

## Dataflow A — reading from the API

```
ShopPage.jsx
  │  useProducts(query)
  ▼
hooks/useProducts.js
  │  loading = true
  │  getProducts(query, signal)
  ▼
services/api.js
  │  fetch('/api/products?q=mug')
  ▼
Vite proxy  →  json-server :8000  →  db.json
  │  JSON
  ▼
hooks/useProducts.js
  │  setProducts(data)
  │  loading = false
  ▼
ShopPage.jsx
  │  re-renders
  ▼
components/ProductCard.jsx  × n
```

Where each failure is handled:

| Failure | Who catches it | What the screen does |
|---|---|---|
| the request is slow | `useProducts` (`loading`) | "Loading..." |
| the server errors | `useProducts` (`error`) | "Something went wrong: ..." |
| the user types again | `useProducts` cleanup | abort the old request, show nothing |

## Dataflow B — writing to the cart (context)

```
ProductCard.jsx
  │  onClick → onAdd(product)      ← a prop, no cart knowledge
  ▼
ShopPage.jsx
  │  addToCart(product)            ← from useCart()
  ▼
context/CartContext.jsx
  │  setCart(...)                  ← one place owns the cart
  ▼
CartProvider re-renders its value
  │
  ├── Header.jsx      count
  └── CartPage.jsx    lines + total
```

The value travels one way: `ProductCard` reports an event upward, the context
owns the state, the consumers read it. Nothing in between needs a prop.

## Why context here, and not for everything

The cart is read by two components in different branches of the tree (the header
and the cart page), and neither is an ancestor of the other. That is the signal.

`page` was *not* moved to context, because the router replaced it entirely. And
`query` stays local to `ShopPage`, because only one component cares.

Rule of thumb: **props until two unrelated components need the same value; context
after that; a global store never, for an app this size.**

## Where does this file go?

| The thing | The home |
|---|---|
| a card shown on four screens | `components/` |
| the `/cart` screen | `pages/CartPage.jsx` |
| `fetch('/api/products')` | `services/api.js` |
| "loading while fetching, cancel the last request" | `hooks/useProducts.js` |
| the cart, needed by header and page | `context/CartContext.jsx` |
| `$24` formatting | `lib/format.js` (not in this app yet) |
| `/api` base URL | `services/api.js` (or `config/env.js` once there are two) |

## The five rules, short version

1. Components render. They do not fetch, and they do not know URLs.
2. A page composes a screen: it calls hooks, reads context, renders components.
3. A hook owns async behaviour and returns `{ data, loading, error }`.
4. A service owns HTTP and returns plain data.
5. Context distributes one value that many distant components read.

## What this app deliberately does not have

- **No state library.** Context is enough for one cart.
- **No TypeScript.** The `db.json` shape is the contract; types would formalise it.
- **No tests.** The service is the easiest place to start, because it has no React.
- **No caching.** TanStack Query replaces `useProducts` in a real project, with the
  same call site.
- **No feature folders.** With six screens you would not notice a difference.
  When one feature's files start living in five folders, that is the signal to switch.

## How the steps produced this

| Step | File that appears |
|---|---|
| s01–s03 | `App.jsx` only |
| s04 | `components/ProductCard.jsx` |
| s07 | `components/Header.jsx` |
| s08 | `pages/ShopPage.jsx`, `pages/CartPage.jsx` |
| s12 | `services/api.js` |
| s13 | `hooks/useProducts.js` |
| s14 | `context/CartContext.jsx` |
| s15 | the folders (a move, not a rewrite) |
| s16 | routing in `App.jsx` |

Nothing was created before it was needed. That is the point of the step order.
