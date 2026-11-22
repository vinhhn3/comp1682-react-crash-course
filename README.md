# Shop — a React crash course, built one small step at a time

Seventeen versions of the same tiny app. Each branch adds **one** thing and is
small enough to read in a minute. The first fifteen are plain beginner React;
the last two turn it into a structured project.

```
npm install
npm run server     # terminal 1 — the API on :8000
npm run dev        # terminal 2 — the app on :5173
```

```
npm run step       # list the steps
npm run step 11    # jump to step 11
```

The dev server keeps running when you switch branches.

## Three zones

| Zone | Where | What it is for |
|---|---|---|
| **CODE** | VS Code | the branch |
| **WEB** | `http://localhost:5173` | the running app |
| **CONCEPT** | `http://localhost:5173/concepts/step.html` | the explanation for the current step |

The concept tab asks the dev server which branch is checked out, so `npm run step 5`
changes the code and the explanation together. `npm run concept` opens it once.

Start with [`START-HERE.md`](START-HERE.md); the minute-by-minute script is
[`docs/run-sheet.md`](docs/run-sheet.md).

| # | Branch | The one thing it teaches |
|---|---|---|
| 0 | `s00-start` | one heading, no components |
| 1 | `s01-one-card` | JSX |
| 2 | `s02-three-cards` | copy-paste pain |
| 3 | `s03-map` | array, `map`, `key` |
| 4 | `s04-component` | `ProductCard`, props |
| 5 | `s05-state` | `useState`, click events, function as prop |
| 6 | `s06-cart` | cart array, derived total |
| 7 | `s07-lift` | `Header`, count passed down |
| 8 | `s08-pages` | two screens, one piece of state |
| 9 | `s09-fetch` | `useEffect`, loading, error |
| 10 | `s10-search` | controlled input, refetch on query change |
| 11 | `s11-abort` | `AbortController`, cancel the last request |
| 12 | `s12-api` | one file for URLs |
| 13 | `s13-hook` | `useProducts` |
| 14 | `s14-context` | `CartProvider`, `useCart` |
| 15 | `s15-folders` | `pages/ components/ hooks/ services/ context/` |
| 16 | `s16-router` | the URL owns the page |

`main` = step 16.

## Where it lands

**`ARCHITECTURE.md`** is the ending: the layer map, the two data flows (API and
context), the import rules, and the "where does this file go" table. Read it
after step 15, then show step 15 itself as a diff of moved files.

## Demo notes

- `npm run server:slow` starts the API with a 2-second delay. Use it on step 10
  to show the stale-result race, then step 11 to fix it.
- The cart lives in memory. A full page reload empties it — that is deliberate at
  this level, and a good question to ask the room.
- Step 15 is a `git mv` plus import changes. Show `git diff --stat` and point at
  the renames: the code did not change, only the address.

## Archive

The first attempt (a fully structured app from step 1, plus concept pages and a
different run sheet) is kept on the branch and tag `v1-archive`. It is not used in
the session.
