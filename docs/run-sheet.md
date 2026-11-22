# Run sheet — 180 minutes, 17 steps

Setup: two terminals (`npm run server`, `npm run dev`), one browser window with the
app and the concept tab. Every `npm run step N` moves both tabs.

**Rules**
- Six minutes per step, not twelve. If a step runs long, cut the demo, not the next step.
- Ask the question on the concept tab, wait three seconds, then answer it.
- Never type a long block. The branch already has the code; type the one-line delta.
- Say the step number out loud. "We are on step six" keeps the room oriented.

---

## 0:00 – 0:06 · The three zones

No code. Point at the three windows.

> "Code, app, explanation. One command moves all three. You will never see a slide."

Then `npm run step 0`.

---

## 0:06 – 0:10 · `s00` one heading

Open `main.jsx`. Three lines matter: root element, `render`, `<App />`.

> "The HTML has one empty div. Everything you will ever see is a tree we put inside it."

---

## 0:10 – 0:16 · `s01` one card

Point at the JSX. Ask: **"Is this HTML?"**

Then: "It is JavaScript. The curly braces are where JavaScript goes."

---

## 0:16 – 0:22 · `s02` three cards

Scroll the file. It is the same six lines three times.

> "This is the code everybody writes first. Look at it honestly: what happens at 100 products?"

---

## 0:22 – 0:32 · `s03` map

Show `products.map`. Point at `key={product.id}`.

> "A list is not a React feature. It is `map` plus identity."

Demo: change `key={product.id}` to `key={index}` live, reorder two products, undo.
Ask: **"Why does React care which card is which?"**

---

## 0:32 – 0:42 · `s04` component + props

Open `ProductCard.jsx`. It takes `({ product })`.

> "The card knows how to draw a product. It does not know where products come from."

Ask: **"Who owns the array now?"**

---

## 0:42 – 0:52 · `s05` state

`npm run step 5`. Then open **`concepts/hooks.html` §1** and press **“…twice”**.

> "It adds one, not two. Both lines read the same snapshot. State is not a variable that changed."

Back to the app: click Add. Then change `setCount(count + 1)` to `count + 1` twice in
the handler to show the same thing live.

---

## 0:52 – 1:02 · `s06` cart

Point at `[...cart, {...product, qty: 1}]` and at `total`.

> "The total is computed on every render. Find the line where it is stored. There isn't one."

Ask: **"What would happen if we stored `total` in state as well?"**

---

## 1:02 – 1:10 · `s07` header

Follow `count` from `App` into `Header`.

> "Two places need it, so it stays here and travels down. Remember how far it travels."

Ask: **"If the header were five components deep, how many files carry this number?"**

---

## 1:10 – 1:20 · Break

Leave step 7 running. People will click Add.

---

## 1:20 – 1:28 · `s08` two pages

Click Shop / Cart. Then **refresh the page** and press **Back**.

> "The page is a boolean. Refresh loses it. Back does nothing. Hold that thought until step 16."

---

## 1:28 – 1:42 · `s09` fetch

`npm run step 9`. Open **`concepts/api.html` §2**: 200, then **Force 500**, then **Go offline**.

> "Three different screens. A 500 is not a blank page, it is a state you design."

Then kill `json-server` for five seconds and reload: the error branch is real.

Ask: **"What is on screen while we wait?"**

---

## 1:42 – 1:50 · `s10` search and the race

Stop the API and restart it with `npm run server:slow`.
Open **`concepts/api.html` §3**, press **Run the race**, then do it in the app:
type `mu` fast.

> "The user typed 'mu'. The screen shows 'm'. Nothing crashed. This is the bug that ships."

---

## 1:50 – 1:58 · `s11` abort

`npm run step 11`. Same typing. It is correct.

Open `hooks/useProducts.js`? No — it does not exist yet. Open `ShopPage.jsx` and point
at `return () => controller.abort();`.

> "The cleanup runs before the next effect. One line, and the stale answer can never land."

Optional: **`concepts/hooks.html` §3** for the ordering diagram.

---

## 1:58 – 2:05 · `s12` api.js

```bash
grep -rn "/api" src
grep -rn "fetch" src
```

One hit each.

> "The URL exists once. Change the backend, change one line."

---

## 2:05 – 2:15 · `s13` useProducts

`ShopPage` loses twenty lines. Point at what is left.

Open **`concepts/hooks.html` §2**, switch `[]` / `[query]` / no array, press
*re-render*, *type in search*, *unmount*.

> "An effect is a contract: run when these change, and clean up before you run again."

---

## 2:15 – 2:30 · `s14` context

Open **`concepts/context.html` §1**. Press **after**, then **before**. Let them see the
two `App.jsx` sizes side by side.

§3: press **add to cart** in both modes. Then read the red note out loud:

> "Context did not make this faster. Every consumer still re-renders. It removed three props
> and made App stop knowing what a cart is. That is the deal."

`npm run step 14`. Point at `App.jsx`.

---

## 2:30 – 2:42 · `s15` folders

```bash
git diff --stat s14-context s15-folders
```

Renames, no logic.

> "The code did not change. Only the address. This is what 'structure' means."

Open `ARCHITECTURE.md` and read the two dataflow chains. Then ask:

> "Where would a currency formatter go? Where does the router live?"

---

## 2:42 – 2:52 · `s16` router

Click a link. Refresh. Back button. Copy the URL.

> "A page is a URL now. That is the whole change."

---

## 2:52 – 3:00 · Close

1. `ARCHITECTURE.md` on screen. Read the five rules.
2. Three questions: *where does a fetch go? where does a formatter go? why context and not props?*
3. "Every file you write next term belongs in one of these folders. If it doesn't, the design is wrong — not you."

---

## Fallbacks

| Situation | Do this |
|---|---|
| 5 min behind | Cut the `grep` demo and the step-8 refresh demo. |
| 10 min behind | Walk steps 12–13 as one block: "the fetch moved twice, first to api.js, then into a hook". |
| 20 min behind | Make 16 a 2-minute demo. Never cut 9–11; that is the centre of the course. |
| Ahead | Run the race twice; add the `key` bug again; ask for a fourth page and wire it live. |
| API will not start | `json-server` is a dev dependency; check `node_modules`. If it is dead, the error branch still teaches something. |
| Concept tab does not follow | `npm run dev` must be running; the tab polls `/__step`. |
