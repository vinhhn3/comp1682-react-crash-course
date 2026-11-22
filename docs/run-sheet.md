# Run sheet — 180 minutes

Assumes: projected laptop, one browser with four tabs (`localhost:5173`,
`concepts/index.html`, `course-map.html`, `HANDOUT.md`), VS Code with the repo
open. Two terminals: `T1` = `npm run dev`, `T2` = `git`.

**Global rules**
- Never type more than eight lines. Check out the branch, type the delta.
- Show the diff, not the file.
- Name the layer out loud every time you open a file.

---

## 0:00 – 0:10 · Why React, and the map

**Screen:** `course-map.html`, section ①.

1. "You already know how to build a page. React is how you build a page that *changes*."
2. "One line: **the screen is a function of state**. You never say 'add a row'. You change state and React works out the row."
3. "So the interesting question is never the element. It is **where the state lives and who may touch it**."
4. Point at the five boxes: "Every file we open today is one of these. By 3:00 you will place any file in five seconds."

No code yet. This is the only talking-head section.

---

## 0:10 – 0:15 · Repo tour

```bash
git checkout 00-start && npm run dev
```

`src/main.jsx` (three lines), `index.html` (one div), `src/styles.css` (tokens).
"One empty div. Everything you see today is a tree we put inside it."

---

## 0:15 – 0:35 · Components, props, lists, keys

```bash
git checkout 01-static-ui
```

**Beat 1** — `ProductCard`: props in, JSX out. No class, no template language.
**Beat 2** — compose: `<ProductList products={PRODUCTS} />`. Data goes down. It never comes back up.
**Beat 3** — `map` + `key`. "Lists are not a React feature. They are `map` plus identity."

**Key demo (30 s, no commit).** Change `key={p.id}` to `key={i}`, reorder two
products, watch DevTools highlight the wrong cards. Undo with `git checkout -- src`.

**Ask:** "How would the card tell the page that Add was clicked?" → props can carry functions. That is 02.

---

## 0:35 – 0:55 · State and events

```bash
git checkout 02-state
```

**Beat 1** — `useState`. "A variable that redraws the component when it changes."

**Beat 2 — the snapshot.** Open `concepts/hooks.html` §1 and press **“…twice”**.
It adds **one**, not two. Say: *"Both lines read the same snapshot. A snapshot is
not a live variable."* Then press the functional version: +2.

**Beat 3 — never mutate.** Change `[...current, item]` to `current.push(item)` and click. Nothing happens. Undo.
"React compares the reference, not the contents."

**Beat 4 — the pain.** The cart count is inside `ProductsPage`. The header can't see it.
"Remember this. 1:10 fixes it. 2:30 fixes it properly."

---

## 0:55 – 1:05 · Forms, lifting, derived state

```bash
git checkout 03-forms-lifting
```

**Controlled input (30 s).** `SearchBar`. Delete `value={value}`: it still types, the list stops filtering. Undo.

**Lifting.** `App.jsx` now owns `cart`. "Two screens need it, so it moves to the nearest common parent. That is all lifting state up is."

**Derived.** `CartSummary`. "We do not store the total. We compute it. Store both and one of them will be wrong."

**Prop drilling.** Follow `count`: `App → AppLayout → Header`. "Three files for one number."

---

## 1:05 – 1:15 · Break

Leave `02-state` or `03` running so people can poke.

---

## 1:15 – 1:30 · The mess, and the race

```bash
git checkout 04-fetch-in-component
```

Let them read `ProductsPage`. It is 40 lines of fetch, three `useState`, a hardcoded
endpoint, and a comment that says this is wrong.

> "This works. It is also the file you will regret in three months."

**Race demo.** `concepts/api.html` §3, press **Run the race**: `m` is slow, `mu` is
fast, the stale answer lands last and wins. Then press **Run with abort**.
Say: *"Nothing crashed. This is the bug that ships."*

**Now reproduce it in the app.** Go back to the browser: `/?chaos=slow=2`, type `mu`
fast. Same wrong list. Say: "same bug, your code."

**Duplication.** `grep -rn "products?q" src` → one hit. "After the cart page, the
detail page, the admin page?" Then `grep -rn "setLoading" src`.

---

## 1:30 – 1:45 · Services, and why failures are states

```bash
git checkout 05-http-service
```

Open `services/http.js` and walk it: base URL, `HttpError`, chaos, mock switch.
Then `productService.js`, then `types/product.js`.

**Kill it with a query param.** In the app:

| URL | Say |
|---|---|
| `/?chaos=slow=2` | "loading is a state, not a moment" |
| `/?chaos=fail` | "the service threw, the page caught" |
| `/?chaos=offline` | "different failure, different words" |

Then `concepts/api.html` §4: `price_cents: 2400` → `price: 24`. "The component
never sees server words. When the backend changes, one file changes."

**The diff.** `git diff 04 05 -- src/pages/ProductsPage.jsx` — two lines out, one in.

---

## 1:45 – 2:05 · The hook, and the one-line fix

`concepts/hooks.html` §2 first, while the app is untouched.

- Pick `[]`, press "re-render", "type in search", "unmount". The log is the only truth.
- Pick `[query]`, press "type in search". Cleanup runs *before* the next effect.
- Say: *"That ordering is the whole fix. Cleanup, then effect."*

```bash
git checkout 06-custom-hook
```

Open `hooks/useProducts.js`. Point at `return () => controller.abort();`.

**Re-run the race.** `/?chaos=slow=2`, type `mu`. It is gone. Network tab shows the
first request `(canceled)`.

**StrictMode.** Two requests on mount. "React mounts twice in dev to catch missing
cleanups. Your abort makes the first harmless. That was the point."

**`ProductsPage`** is now four lines of data logic. "Same behaviour. Different address."

**DevPanel.** `?debug=1`, click Add:

```
state   App.addToCart   p-12
```

"At 2:30 those labels become layers."

---

## 2:05 – 2:30 · The refactor, as a diff

Do not re-open files. Show diffs.

```bash
git diff 04 05 -- src/pages/ProductsPage.jsx
git diff 05 06 --stat
git diff 06 07 -- src/App.jsx
```

Then `course-map.html` §⑤. Read the matrix one row at a time. Ask the room to name
the forbidden cell that matters most (answer: a component importing `services/`).

**Ten-second quiz.** Call a file, room shouts the layer:
`formatCurrency` → `lib` · `http.js` → `services` · `CartBadge` → `components` ·
`useProducts` → `hooks` · `CartProvider` → `context` · `env.js` → `config`.

Say: *"The most valuable thing on the screen is not the code. It is the diff. Code
tells you what a thing is; a diff tells you why it exists."*

---

## 2:30 – 2:55 · Context — 25 minutes, because this is where people get lost

**Step 1 (3 min) — feel it.** `concepts/context.html` §1, press **Send the value
down**. `AppLayout` and `Header` light up even though they never read the cart.
Point at the signatures: `function Header({ cart })` where `cart` is unused.

**Step 2 (3 min) — skip it.** Same page §2. The middle goes dim. "The value still
comes from above. You made the lookup skip the middle, not the data global."

**Step 3 (5 min) — the part they guess wrong.** §3, press **add to cart** in
"with context": **2 re-rendered**. Switch to "with props": **4 re-rendered**.
Ask them to predict before you click. Then say: *"Context has no selector. Every
consumer re-renders. That is why it is not for everything."*

```bash
git checkout 07-context
```

**Step 4 (8 min) — the code.** `hooks/useCart.js` (behaviour), then
`context/CartContext.jsx` (delivery, ~15 lines). Then `Header` — no cart props.
Then `App.jsx`: navigation is *still* props. "Context was worth it for the cart.
It would not be worth it for `page`."

**Step 5 (3 min) — break it.** Remove `<CartProvider>` from `App`. Reload. Read the
error out loud: *useCart must be used inside CartProvider*. Put it back.
"Failing loudly is a feature."

**Step 6 (3 min) — the trace.** `?debug=1`, add to cart: four layers in one panel.

```bash
git diff 06 07 --stat
```

---

## 2:55 – 3:00 · Router, and close

```bash
git checkout 08-router
```

Click a product. Show `/products/p4`. Back button. Refresh — still works.
`git diff 07 08 -- src/App.jsx`: a `useState`, a ternary and a prop disappeared.
"Page state belongs in the URL. That is it."

**Close (90 s).**
1. `HANDOUT.md` on screen, read the layer map once more.
2. Three questions from the quiz, hands up.
3. "Every file you write next term belongs in one of five boxes. If you cannot place it, the design is wrong — not you."
4. Leave them: `git branch`.

**If 60 seconds left:** "The most valuable thing you saw today was a diff. Code tells you what a thing is. A diff tells you why it exists."

---

## Fallbacks

| Failure | Do this |
|---|---|
| No network for `npm install` | Pre-install before the session. Nothing else needs the network — the mock server is local. |
| Dev server dies | `Ctrl-C`, `npm run dev`. Keep talking. |
| A concept page does not open | They are static files; open them straight from Finder. No server required. |
| Student is lost | Point at their branch name. "You are on 04. That is supposed to be messy." |
| 10 min behind | Cut the `grep` demo and the router close. Never cut 04 → 06. |
| 20 min behind | Make router a 2-minute demo, move context §5 to the handout. The refactor is the course. |
| Ahead of time | Add the `cart.push` bug, the index-key bug, and the StrictMode question. |
| Context is not landing | Stop at §1–2 of `context.html`, then show `07` and say "read §5 in the handout". Do not try to do the re-render counter live if the room is already full. |
