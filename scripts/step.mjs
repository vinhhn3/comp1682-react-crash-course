#!/usr/bin/env node
/**
 * Switch to a step branch by number, without remembering branch names.
 *
 *   npm run step 2      → 02-state
 *   npm run step 6      → 06-custom-hook
 *   npm run step        → prints the map
 */
import { execSync } from 'node:child_process';

const STEPS = {
  0: ['00-start', 'scaffold'],
  1: ['01-static-ui', 'components + props, hardcoded data'],
  2: ['02-state', 'useState cart, lists, events'],
  3: ['03-forms-lifting', 'forms, cart page, state lifted to App'],
  4: ['04-fetch-in-component', 'DELIBERATELY WRONG: fetch inside the component'],
  5: ['05-http-service', 'services/http.js + productService + DTO mapping'],
  6: ['06-custom-hook', 'useProducts + useDebounce + AbortController + DevPanel'],
  7: ['07-context', 'CartProvider + useCart, prop drilling gone'],
  8: ['08-router', 'React Router, detail page, config/routes.js'],
};

const arg = process.argv[2];

if (!arg) {
  console.log('\n  npm run step <n>\n');
  for (const [n, [branch, note]] of Object.entries(STEPS)) {
    console.log(`  ${n}  ${branch.padEnd(24)} ${note}`);
  }
  console.log('\n  the dev server keeps running — Vite reloads by itself.\n');
  process.exit(0);
}

const entry = STEPS[arg];
const branch = entry ? entry[0] : arg;

try {
  execSync(`git checkout ${branch}`, { stdio: 'inherit' });
  console.log(`\n  now on ${branch} — open http://localhost:5173\n`);
} catch {
  console.error(`\n  could not check out "${branch}". Run "npm run step" to see the list.\n`);
  process.exit(1);
}
