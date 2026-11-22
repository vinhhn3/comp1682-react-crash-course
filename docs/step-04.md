# Step 04 — fetch inside the component (on purpose)

**Branch:** `04-fetch-in-component`

> This branch is **wrong on purpose**. Do not copy it. The whole next hour is
> undoing it.

## What changed

- `mock/server.js` — a fake backend at the repo root. Not app code. It has latency and persists the cart in localStorage.
- `ProductsPage` now fetches on mount and on every keystroke, inline, with three `useState` calls and a hardcoded endpoint.

## The five problems, in the file

1. `/products?q=` is a string inside a component.
2. The next screen that needs products will copy this effect.
3. No abort: the slowest response wins.
4. loading / error / empty are re-invented here.
5. Nothing is testable without a browser.

## Demo beats

**The race (the important one).**

1. Open `/?chaos=slow=2`.
2. Clear the search, then type `mu` quickly (two keystrokes, two requests).
3. The result for `m` arrives after the result for `mu`. The list ends up wrong, the input says `mu`.
4. No error, no warning. Just the wrong answer.

Say: *"Nothing crashed. This is the bug that ships."*

**The duplication.** In the terminal:

```bash
grep -rn "products?q" src
```

One hit today. Ask: "what does this look like after the cart page, the detail page, and the admin page?" Three hits. Then `grep` for `setLoading` — it will be in every one of them.

**The missing dependency conversation.** Works, but ask: "what happens when `query` changes while the old request is still in flight?" Let them answer. Then go to `05`.

## What to say

> "This code is not stupid. Every one of you would write it. It is what the happy path looks like when nobody has told you where things belong. Now watch what it costs."

## Do not

- Do not fix anything here. No abort, no debounce, no cleanup.
- Do not add a `useCallback` to "improve" it. The point is the shape, not the micro-optimisation.
