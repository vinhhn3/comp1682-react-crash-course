#!/usr/bin/env node
/**
 * npm run step        → list
 * npm run step 4      → s04-component
 */
import { execSync } from 'node:child_process';

const STEPS = {
  0: ['s00-start', 'one heading, no components'],
  1: ['s01-one-card', 'JSX'],
  2: ['s02-three-cards', 'copy-paste pain'],
  3: ['s03-map', 'lists and key'],
  4: ['s04-component', 'components and props'],
  5: ['s05-state', 'useState, events'],
  6: ['s06-cart', 'an array in state, a derived total'],
  7: ['s07-lift', 'lifting state up (and drilling)'],
  8: ['s08-pages', 'two screens, one boolean'],
  9: ['s09-fetch', 'useEffect, loading and error'],
  10: ['s10-abort', 'cleanup, and the request race'],
  11: ['s11-api', 'one file for URLs'],
  12: ['s12-hook', 'a custom hook'],
  13: ['s13-context', 'context instead of drilling'],
  14: ['s14-folders', 'the folder structure, at the end'],
  15: ['s15-router', 'the URL owns the page'],
};

const arg = process.argv[2];

if (!arg) {
  console.log('');
  for (const [n, [branch, note]] of Object.entries(STEPS)) {
    console.log(`  ${n.padStart(2)}  ${branch.padEnd(18)} ${note}`);
  }
  console.log('');
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
