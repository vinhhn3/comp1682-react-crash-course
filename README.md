# Shop — a React crash course, built one small step at a time

Sixteen versions of the same tiny app. Each branch adds **one** thing and is
small enough to read in a minute.

```
npm install
npm run dev        # localhost:5173
npm run step       # list the steps
npm run step 4     # jump to step 4
```

| # | Branch | The one thing it teaches |
|---|---|---|
| 0 | `s00-start` | one heading, no components |
| 1 | `s01-one-card` | JSX |
| 2 | `s02-three-cards` | copy-paste pain |
| 3 | `s03-map` | lists and `key` |
| 4 | `s04-component` | components and props |
| 5 | `s05-state` | `useState`, events |
| 6 | `s06-cart` | an array in state, a derived total |
| 7 | `s07-lift` | lifting state up (and prop drilling) |
| 8 | `s08-pages` | two screens, one boolean |
| 9 | `s09-fetch` | `useEffect`, loading and error |
| 10 | `s10-abort` | cleanup, and the request race |
| 11 | `s11-api` | one file for URLs |
| 12 | `s12-hook` | a custom hook |
| 13 | `s13-context` | context instead of drilling |
| 14 | `s14-folders` | the folder structure, at the end |
| 15 | `s15-router` | the URL owns the page |

The first twelve steps use the same plain code you would write without thinking
about architecture: `const App = () => {}`, `useState`, `fetch` in a `useEffect`,
`try/catch`. Folders, hooks and context appear only when the app has earned them.

## Archive

The first attempt (a fully structured app from step 1) is kept on the branch and
tag `v1-archive`. It is not used in the session.
