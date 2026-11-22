# Step 07 — context

**Branch:** `07-context`

## What changed

```
src/
├── hooks/useCart.js              ← the behaviour (was in App)
├── context/CartContext.jsx       ← the delivery
├── services/cartService.js       ← POST /cart, PATCH, DELETE
├── types/cart.js                 ← DTO → line
├── components/cart/CartBadge.jsx ← no props
├── components/layout/Header.jsx  ← no count prop
├── App.jsx                       ← no cart state at all
└── pages/*.jsx                   ← read from useCart()
```

## The diff worth showing

```bash
git diff 06 07 --stat
git diff 06 07 -- src/App.jsx
git diff 06 07 -- src/components/layout/AppLayout.jsx
```

`AppLayout` lost `count` entirely. That is the point: the shell stopped caring.

## What to look at

1. **The split.** `hooks/useCart.js` is behaviour, `context/CartContext.jsx` is delivery. Neither knows about the other's job.
2. **`useCart` throws** if there is no provider. A silent `null` would produce "cannot read property of null" three files away.
3. **`App.jsx` still has `page` as props.** Say it clearly: *"navigation is shared by two things, so props are fine. Context is for the cart because many distant components read it. Do not move everything."*
4. **Derived values** (`count`, `total`) live in the hook and are recomputed, never stored.

## Demo beats

**Delete a prop and watch it still work.** In `Header`, remove the `count` prop, then show `CartBadge`. Add to cart — the badge still updates.

**The re-render story.** Open the concept page `concepts/context.html`, section 3. Compare "with props" (4 re-renders) and "with context" (2). Then come back and point at `ProductCard` — it does not re-render when the badge changes.

**The error.** Remove `<CartProvider>` from `App` and load the page. You get a clear error: *useCart must be used inside CartProvider*. Put it back. Say: *"failing loudly is a feature."*

**DevPanel.** `?debug=1`, add to cart. The trace now reads across four layers:

```
context  CartProvider      items: 3
service  cartService.add   POST /cart p12
hook     useCart.add       p12
```

## What to say

> "Context did not add a feature. It removed three props. That is what makes it worth the extra file."

## Exercise

Delete every cart prop from `App` and `AppLayout`. The app must still work. Then add a `CartTotal` component in the footer that reads `total` from context — and notice that `ProductsPage` still does not re-render.
