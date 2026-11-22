# Run sheet — 180 minutes

Assumes: projected laptop, one browser with three tabs (`localhost:5173`,
`course-map.html`, `HANDOUT.md`), VS Code with the repo open, terminals ready.

Two terminals:
- `T1` — `npm run dev`
- `T2` — `git` for checkouts and diffs

**Global rule:** never type more than eight lines. Check out the branch, type the delta.

---

## 0:00 – 0:12 · Why React, and the map

**Screen:** `course-map.html`, section ① only.

Say, in this order:

1. "You already know how to build a page. React is a way to build a page that *changes*."
2. "The whole mental model is one line: **the screen is a function of state**. You never say 'add a row'. You say 'the state changed' and React works out the row."
3. "Which means the interesting question is never 'which element', it is **where does the state live and who may touch it**."
4. Point at the layer map: "For three hours, every file we open will be one of these five boxes. At the end you will be able to place any file in under five seconds."

**Do not** demo anything yet. No code. This is the only talking-head section.

**Fallback:** if the room is cold, ask "who has used React?" and "who has used Vue?" — then say "same idea, different spelling."

---

## 0:12 – 0:15 · Repo tour

```bash
git checkout 00-start
npm run dev
```

Show: `src/main.jsx` (3 lines), `index.html` (one div), `src/styles.css` (tokens).
Say: "The HTML has one empty div. Everything you will see is a tree we put inside it."

---

## 0:15 – 0:40 · Components, props, lists, keys

```bash
git checkout 01-static-ui
```

**Beat 1 — the component is a function that returns markup.** Open `ProductCard.jsx`.
Say: "It takes props, it returns JSX. That's it. No class, no template language."

**Beat 2 — compose.** Open `ProductsPage.jsx`. Point at `<ProductList products={PRODUCTS} />`.
Say: "Data goes down through props. It never comes back up. If you need something back, you pass a function down."

**Beat 3 — `map`.** Open `ProductList.jsx`. Highlight the `map`.
Say: "Lists in React are not a feature. They are `map` plus a `key`."

**Demo the key bug (30 s, no commit).** In `ProductList`, change `key={p.id}` to `key={i}`,
open React DevTools, highlight updates, then reorder `PRODUCTS` in the file (move the first
product to the end). Watch React keep the old DOM nodes.
Say: "Keys are identity. The index is not identity — it is position, and position changes."
**Undo the edit immediately.** `git checkout -- src`

**Checkpoint question:** "Why doesn't `ProductCard` need to know where the products came from?"
Answer: separation of concerns — but do not use that phrase. Say: "because it was handed them."

---

## 0:40 – 1:00 · State and events

```bash
git checkout 02-state
```

**Beat 1.** Open `ProductsPage.jsx`. Point at `const [cart, setCart] = useState([])`.
Say: "State is a variable that, when it changes, redraws the component. That is the whole trick."

**Beat 2 — do not mutate.** Show the add handler using `[...cart, product]`, then change it
live to `cart.push(product)` and show nothing happens. Undo.
Say: "React compares identity, not contents. New array or nothing happens."

**Beat 3 — updates are asynchronous.** Add `console.log(cart.length)` right after `setCart`
and click twice. It logs the *old* length.
Say: "You are reading this render's state. The next render gets the new one."

**Beat 4 — the pain.** Point at the cart count: it is rendered *inside* `ProductsPage`.
Say: "The header can't see it. The cart page can't see it. That is today's problem."

---

## 1:00 – 1:10 · Break

Leave `07-context` checked out? No. Leave `02-state` running so people can poke.

---

## 1:10 – 1:30 · Forms, lifting state, derived state

```bash
git checkout 03-forms-lifting
```

**Beat 1 — controlled input.** `SearchBar.jsx`. Type in it, then delete `value={value}` and
show the input still types but the list doesn't filter. Undo.
Say: "Two-way binding in React is one line: value in, onChange out."

**Beat 2 — lifting.** Open `App.jsx`. The cart now lives here.
Say: "Two screens need the same data. So it moves to the nearest common parent. That's it. That's 'lifting state up'."

**Beat 3 — derived state.** Open `CartSummary.jsx`. Point at `total`.
Say: "We do not store the total. We compute it from the lines. If you store both, you have two truths and one of them will be wrong."

**Beat 4 — the prop-drilling pain.** Follow one prop: `App → AppLayout → Header → CartBadge`.
Say: "Four files to move one number. Remember this. We fix it at 2:35."

---

## 1:30 – 2:05 · Effects and the API — the mess, then the fix

### 1:30 – 1:45 · The mess

```bash
git checkout 04-fetch-in-component
```

Open `ProductsPage.jsx`. Let them read it. It is 40 lines of fetch, three `useState`, a
hardcoded URL, and a comment that says this is wrong.

Say: "This works. It is also the file you will regret in three months. Let's prove it."

**Demo 1 — the race.** `?chaos=slow=1`, type `mu` fast, then `g`.
The results for `mu` arrive after the results for `mug`.
Say: "Two requests, no ordering. The last one to arrive wins, and it isn't the one you asked for last."

**Demo 2 — duplication.** `grep -rn "localhost:3001" src` → three hits.
Say: "Change the API and you change three files. Miss one and it fails at 2am."

### 1:45 – 2:05 · The fix, layer by layer

```bash
git checkout 05-http-service
```

Open `services/http.js`. Walk it top to bottom:
- base URL from `config/env.js`
- chaos block — demo `?chaos=fail` and `?chaos=offline` **now**, on the list page
- mock switch — "this is the only line that knows a backend exists"
- `HttpError`

Then `services/productService.js` (three lines) and `types/product.js` (`price_cents → price`).
Say: "The component asks for products. It does not know what a status code is."

Then:
```bash
git checkout 06-custom-hook
```

Open `hooks/useProducts.js`. Point at the cleanup: `controller.abort()`.
Re-run the race demo. It is gone.
Say: "One line. The previous request is cancelled before it can be wrong."

Open `ProductsPage.jsx` — now four lines.
Say: "Same behaviour. Different address."

**DevPanel:** add `?debug=1`, click add-to-cart, point at the trace.

---

## 2:05 – 2:35 · The refactor, as a diff

Do **not** re-open files. Show diffs.

```bash
git diff 04 05 -- src/pages/ProductsPage.jsx
```

Say: "Red is detail moving down a layer. Nothing else changed."

```bash
git diff 05 06 --stat
git diff 06 07 -- src/App.jsx
```

Then put `course-map.html` section ⑤ on screen for 60 seconds. Read the matrix out loud,
one row at a time. Ask the room to name the forbidden cell that matters most.

**The ten-second exercise:** call out a file, room shouts the layer.
`formatCurrency` … `http.js` … `CartBadge` … `useProducts` … `CartProvider` … `env.js`.

---

## 2:35 – 2:50 · Router and context

```bash
git checkout 07-context
```

`git diff 06 07 --stat` → the prop chain disappears.
Open `CartContext.jsx` (provider + `useCart`), then `Header.jsx` — no cart props.
Say: "Context is not global state because it's convenient. It's for state that many unrelated components need. Everything else should still be props."

```bash
git checkout 08-router
```

Show the URL bar: `/`, `/products/p2`, `/cart`. Back button works.
Open `config/routes.js` and `pages/ProductDetailPage.jsx`.
Say: "The page is chosen by the URL, not by a `useState` in `App` — which is what we were doing an hour ago."

---

## 2:50 – 3:00 · Close

1. `HANDOUT.md` on screen. Read the layer map out loud one last time.
2. Quiz: ask three of the ten questions, hands up.
3. "Every file you write next term belongs in one of five boxes. If you can't place it, the design is wrong — not you."
4. Leave them: `git branch` and the eight branch names.

**If you have 60 seconds left,** say this: "The most valuable thing on this screen is the diff, not the code. Code tells you what a thing is. A diff tells you why it exists."

---

## Fallbacks

| Failure | Do this |
|---|---|
| `npm install` fails / no network | Repo still works if `node_modules` was pre-installed. Otherwise demo from a recorded run. |
| Dev server dies | `Ctrl-C`, `npm run dev`, keep talking. Nothing in this course needs a fast restart. |
| No internet for fonts | None used. Everything is system fonts. |
| Student is lost | Point at their branch name, not their screen. "You're on 04. That's supposed to be messy." |
| You are 10 min behind | Cut the index-key demo and the `grep` demo. Never cut 04 → 06. |
| You are 20 min behind | Make router a demo (2 min) and move context to a handout reference. The refactor block is the course. |
| You are ahead | Add the `key` bug, the `cart.push` bug, and the StrictMode double-fetch question. |
