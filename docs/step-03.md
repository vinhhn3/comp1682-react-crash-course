# Step 03 — forms, lifting state, derived state

**Branch:** `03-forms-lifting`

## What changed

```
src/
├── App.jsx                      ← cart lifted here; also `page` state
├── pages/CartPage.jsx           ← new
├── components/
│   ├── cart/CartLine.jsx        ← qty controls, remove
│   ├── cart/CartSummary.jsx     ← coupon form, derived totals
│   ├── product/SearchBar.jsx    ← controlled input
│   ├── common/EmptyState.jsx
│   └── layout/Header.jsx        ← accepts page, count, onNavigate
```

## What to look at

1. **Lifting.** `cart` moved from `ProductsPage` to `App` because two screens need it. Nothing else about the cart changed.
2. **Controlled input.** `SearchBar` has `value` and `onChange`. Delete `value={value}` and the input still types, but the list stops filtering — the DOM and React have drifted apart.
3. **Derived state.** `subtotal`, `discount`, `shipping`, `total` are computed on every render. There is no `setTotal`.
4. **`key={line.id}`** in `CartPage`. Identity, not position.
5. **The prop chain.** `count` travels `App → AppLayout → Header`. Three files for one number.

## Demo beats

**Controlled input (30 s).** Type in search. Delete `value={value}`. Type again: the box fills, the grid does not move. Undo.

**The index-key bug (60 s).** In `CartPage`, change `key={line.id}` to `key={index}` (add `index` to the map). Add three different products, set the middle one's quantity to 3, then remove it. The quantity input for the row below keeps the wrong value, because React reused the DOM node.
Say: *"The dom node stayed. The data moved. The key was the only thing that could tell React the difference."* Undo.

**Derived vs stored.** Ask: "what happens if we also store `total` in state and forget to update it?" Answer: a cart that adds up wrong, and no error anywhere.

## What to say

> "Two screens need the same number, so the number moves to the nearest parent that owns both. That is all lifting state up is. The price is that everything in between has to carry it."

## Exercise

Add a "Top rated only" checkbox above the grid. It filters `matches`. It must not be stored in state — derive it from the checkbox plus the query.
