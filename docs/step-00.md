# Step 00 — the scaffold

**Branch:** `00-start`

## What is here

- `npm create vite` equivalent, written by hand so nothing is hidden
- `src/main.jsx` mounts `<App />` into `#root`
- `src/App.jsx` renders a placeholder
- `src/styles.css` — all the design tokens and classes used for the rest of the course

## What to look at

1. `main.jsx` — three lines matter: import React's DOM client, find `#root`, render. That is the entire bootstrap.
2. `index.html` — the `<div id="root">` and a `<script type="module" src="/src/main.jsx">`. Vite serves this file; there is no bundler config to explain.
3. `styles.css` — CSS variables at the top. Every colour in the app comes from six tokens.

## What to say

> "Every React app you will ever see starts like this: an HTML file with one empty div, and a JS file that puts a tree inside it. The rest of this course is about what goes in that tree."

## Do not

- Do not explain JSX yet. It shows up in 30 seconds.
- Do not explain the build. It is a dev server; move on.
