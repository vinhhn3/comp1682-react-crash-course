# Market — a 3-hour React crash course

One shop app, built eight times. Each step is a working branch, and the whole
point of the course is the **refactor**: students feel the mess, then watch it
move into layers.

No slides. One screen, three panes (editor, browser, DevTools), nine branches.

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

| Time | Block | Branch |
|---|---|---|
| 0:00–0:12 | Mental model, the layer map | `course-map.html` |
| 0:12–0:15 | Repo tour | `00-start` |
| 0:15–0:40 | Components, props, lists, keys | `01` → `02` |
| 0:40–1:00 | State, events, re-renders | `02` |
| 1:00–1:10 | **Break** | |
| 1:10–1:30 | Forms, lifting state, derived state | `03` |
| 1:30–2:05 | Effects + API: the mess, then the fix | `04` → `05` → `06` |
| 2:05–2:35 | Refactor: layers, imports, dataflow | diff `04 05 06` |
| 2:35–2:50 | Router + Context | `07` → `08` |
| 2:50–3:00 | Decision-tree quiz, checklist | `HANDOUT.md` |

Full script, demo beats and fallbacks: `docs/run-sheet.md`.

---

## Files worth opening first

- `src/` — the final architecture (`08-router`): `pages/`, `components/`, `hooks/`, `context/`, `services/`, `lib/`, `config/`, `types/`, `router/`
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

## Is this repo any good for a different audience?

Swap `src/services/mockApi` for a real backend and it is a normal small shop.
The steps are additive, so any branch is a valid starting point. The one thing
that does not survive: teaching `04` as "the right way" — it is deliberately
wrong, and the README on that branch says so.
