#!/usr/bin/env node
/**
 * npm run step        → list
 * npm run step 11     → s11-abort
 */
import { execSync } from 'node:child_process';

const STEPS = {
  0: ['s00-start', 'one heading'],
  1: ['s01-one-card', 'JSX, one hardcoded card'],
  2: ['s02-three-cards', 'copy-paste pain'],
  3: ['s03-map', 'array, map, key'],
  4: ['s04-component', 'ProductCard, props'],
  5: ['s05-state', 'useState, click, function as prop'],
  6: ['s06-cart', 'cart array, derived total'],
  7: ['s07-lift', 'Header, count passed down'],
  8: ['s08-pages', 'two screens, one piece of state'],
  9: ['s09-fetch', 'useEffect, loading, error'],
  10: ['s10-search', 'controlled input, refetch on query'],
  11: ['s11-abort', 'AbortController, cancel the last request'],
  12: ['s12-api', 'one file for URLs'],
  13: ['s13-hook', 'useProducts'],
  14: ['s14-context', 'CartProvider, useCart'],
  15: ['s15-folders', 'pages/ components/ hooks/ services/ context/'],
  16: ['s16-router', 'the URL owns the page'],
};

const arg = process.argv[2];

if (!arg) {
  console.log('');
  for (const [n, [branch, note]] of Object.entries(STEPS)) {
    console.log(`  ${n.padStart(2)}  ${branch.padEnd(16)} ${note}`);
  }
  console.log('\n  the dev server keeps running — Vite reloads by itself.\n');
  process.exit(0);
}

const branch = STEPS[arg] ? STEPS[arg][0] : arg;

try {
  execSync(`git checkout ${branch}`, { stdio: 'inherit' });
  console.log(`\n  now on ${branch} — reload http://localhost:5173\n`);
} catch {
  console.error(`\n  no branch "${branch}". Run npm run step to see the list.\n`);
  process.exit(1);
}
