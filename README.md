# Market — a 3-hour React crash course

One shop app, built eight times. Each step is a working branch, and the whole
point of the course is the **refactor**: students feel the mess, then watch it
move into layers.

No slides. One screen, three panes (editor, browser, DevTools), nine branches.

**New here? Read [`START-HERE.md`](START-HERE.md) first — it is the five-minute dry run.**

---

## Quickstart

```bash
npm install
git branch                 # pick a step
git checkout 08-router
npm run dev                # http://localhost:5173
```

| URL | What it does |
|---|---|
| `/` | product list, live search |
| `/products/:id` | detail page (`08-router` only) |
| `/cart` | cart lines, quantity, coupon, totals |
| `/?debug=1` | opens the DevPanel event trace (`06` and later) |
| `/?chaos=fail` | fake 500 from the API (`05` and later) |
| `/?chaos=slow=2` | 2s latency (`05` and later) |
| `/?chaos=offline` | fake network failure (`05` and later) |

No backend required: `services/http.js` talks to an in-memory mock server with
localStorage persistence. Set `VITE_USE_MOCK=false` and `VITE_API_URL=…` in
`.env` to point at a real one.

---

## Branch map

| Branch | What is true at this point | Pain it creates |
|---|---|---|
| `00-start` | Vite scaffold, an empty app | — |
| `01-static-ui` | Pages and components, hardcoded products | Nothing works |
| `02-state` | `useState` cart, add works, list renders | Cart count lives on one page |
| `03-forms-lifting` | Cart page, controlled qty inputs, search, coupon, cart lifted to `App` | `App` now passes five props through four levels |
| `04-fetch-in-component` | `useEffect` + `fetch` **inside** `ProductsPage` | URL in a component, duplicated loading logic, race bug |
| `05-http-service` | `services/http.js` + `productService.js` + DTO mapping | Page still owns loading/error |
| `06-custom-hook` | `useProducts` + `useDebounce` + `AbortController` + DevPanel | Cart still prop-drilled |
| `07-context` | `CartProvider` + `useCart`, prop drilling gone | Navigation is hand-rolled |
| `08-router` | React Router, detail route, `config/routes.js` | — (final) |

`main` == `08-router`.

Each branch carries its own `docs/step-NN.md` with **what changed, why, and
what to look at**.

---

## The 180-minute run sheet

| Time | Block | Branch / page |
|---|---|---|
| 0:00–0:10 | Mental model, the layer map | `course-map.html` |
| 0:10–0:15 | Repo tour | `00-start` |
| 0:15–0:35 | Components, props, lists, keys | `01` |
| 0:35–0:55 | State, events, snapshots | `02` + `concepts/hooks.html` §1 |
| 0:55–1:05 | Forms, lifting state, derived state | `03` |
| 1:05–1:15 | **Break** | |
| 1:15–1:30 | The messy fetch, the request race | `04` + `concepts/api.html` §3 |
| 1:30–1:45 | Services, DTO → model, error states | `05` + `concepts/api.html` §4–5 |
| 1:45–2:05 | The hook, cleanup, abort | `06` + `concepts/hooks.html` §2–3 |
| 2:05–2:30 | The refactor, as a diff | diff `04 05 06` |
| 2:30–2:55 | Context: drill, skip, re-render | `07` + `concepts/context.html` |
| 2:55–3:00 | Router, close | `08` |

Full script, demo beats and fallbacks: `docs/run-sheet.md`.

---

## Files worth opening first

- `src/` — the final architecture (`08-router`): `pages/`, `components/`, `hooks/`, `context/`, `services/`, `lib/`, `config/`, `types/`, `router/`
- `concepts/` — **three interactive pages** for the parts students get stuck on: hooks, API handling, context. Static HTML, no build, no server; open them in any browser.
- `course-map.html` — the four diagrams you keep coming back to
- `HANDOUT.md` — the student take-home: rules, both dataflow chains, quiz
- `docs/run-sheet.md` — minute-by-minute teaching notes
- `docs/step-NN.md` — per-branch change log
- `.tours/` — CodeTour files for the four hardest reads (install the CodeTour extension)
- `mock/server.js` — the fake backend; not app code, and deliberately outside `src/`

---

## Teaching rules

1. **Never type a long block.** Check out the branch, then type only the 3–8 line delta that matters.
2. **Show the diff, not the file.** "Same behaviour, different address."
3. **Break it on purpose.** `?chaos=…` for HTTP, index keys for lists, no `AbortController` for the race.
4. **Walk the stack once.** Breakpoint → F11 → F11 → resume. The call stack *is* the layer diagram.
5. **Name the layer out loud** every time you open a file.

---

## Where students get stuck, and what to open

Three interactive pages in `concepts/`. They are the visual aid — there is no deck.

| Stuck on | Open | What to press |
|---|---|---|
| "why did two `setCount` calls only add one?" | `concepts/hooks.html` §1 | **…twice**, then the functional version |
| "when does `useEffect` run?" | `concepts/hooks.html` §2 | switch `[]` / `[query]` / no array, then re-render, change query, unmount |
| "why does the search show the wrong results?" | `concepts/api.html` §3 | **Run the race**, then **Run with abort** |
| "what does the server actually send?" | `concepts/api.html` §4 | the DTO → model side-by-side |
| "what is a 500 supposed to look like?" | `concepts/api.html` §2 | 200 / 500 / offline |
| "why not just props?" | `concepts/context.html` §1 | **Send the value down** |
| "what re-renders when the cart changes?" | `concepts/context.html` §3 | **add to cart** in both modes |

`concepts/index.html` is the hub. Everything is static HTML — no dev server needed,
so it still works if the build breaks in front of the room.

---

## Is this repo any good for a different audience?

Swap `mock/server.js` for a real backend (`VITE_USE_MOCK=false`) and it is a normal
small shop. The steps are additive, so any branch is a valid starting point. The one
thing that does not survive: teaching `04` as "the right way" — it is deliberately
wrong, and the step notes say so.
