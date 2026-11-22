# Step 01 — static UI

**Branch:** `01-static-ui`

## What changed

```
src/
├── components/
│   ├── common/Button.jsx          ← first reusable primitive
│   ├── layout/Header.jsx
│   ├── layout/AppLayout.jsx       ← the shell every page renders inside
│   └── product/ProductCard.jsx    ← props in, JSX out
│       product/ProductList.jsx    ← map() + key
├── pages/ProductsPage.jsx         ← hardcoded PRODUCTS array
└── App.jsx                        ← layout + page
```

## What to look at

1. **`ProductCard`** takes `product` and returns markup. It has no idea where products come from, and that is the point.
2. **`ProductList`** is `products.map(...)` with `key={product.id}`. Not a React feature — plain JavaScript.
3. **`ProductsPage`** owns the data. Today it is a constant.
4. **`Header`** uses `<a href>` on purpose. Clicking "Cart" reloads the whole page. That is the problem router solves at step 08.

## Demo beats

- **Keys.** Change `key={product.id}` to the index, then reorder two products in `PRODUCTS`. With React DevTools → Highlight updates, the wrong cards flash. Undo.
- **Props flow one way.** Ask: "how would `ProductCard` tell `ProductsPage` that Add was clicked?" Answer: it can't — you pass a function down. That is step 02.

## What to say

> "Three components, one page, zero logic. Everything you can see is a function that returned markup. Notice what is *missing*: no `document.querySelector`, no `innerHTML`, no manual updates."

## Exercise

Add a "New" badge to the three most recently added products (just the last three in the array). No state allowed.
