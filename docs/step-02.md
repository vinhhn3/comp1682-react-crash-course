# Step 02 — state

**Branch:** `02-state`

## What changed

- `ProductsPage` owns `const [cart, setCart] = useState([])`
- `addToCart` increments an existing line or appends a new one — always with new arrays and objects
- `ProductCard` gained `onAdd`; `ProductList` passes it through
- The page renders its own count badge

## What to look at

1. `setCart((current) => ...)` — the functional form. React hands you the latest state, so two fast clicks cannot overwrite each other.
2. `{ ...line, qty: line.qty + 1 }` — new object, not a mutation. React compares identity.
3. `[...current, {...product, qty: 1}]` — new array. Same reason.
4. **The pill is inside `ProductsPage`.** The header still shows 0. That is the design pain of this step.

## Demo beats

- **Mutation.** Replace the body of `addToCart` with `cart.push({...product, qty: 1})` and click. Nothing happens. Say: "React does not look inside. It looks at the reference."
- **Async state.** Log `cart.length` right after `setCart`. It prints the previous render's length.
- **The pain.** Point at the header badge. Ask the room: "how does this number get up there?" Wait for "pass it up", then: "up to where?"

## What to say

> "State is a variable that redraws the component when it changes. The interesting question is not *how* to change it — that is one function call. It is **who should own it**."

## Exercise

Add a "Remove last" button next to the count. It must produce a new array.
