#!/usr/bin/env node
// Prints the step branches in order, so students can see where they are.
import { execSync } from 'node:child_process';

const STEPS = [
  ['00-start', 'scaffold'],
  ['01-static-ui', 'pages + components, hardcoded data'],
  ['02-state', 'useState cart, lists, events'],
  ['03-forms-lifting', 'forms, cart page, state lifted to App'],
  ['04-fetch-in-component', 'DELIBERATELY MESSY: fetch inside the component'],
  ['05-http-service', 'services/http.js + productService + DTO mapping'],
  ['06-custom-hook', 'useProducts + useDebounce + AbortController + DevPanel'],
  ['07-context', 'CartProvider + useCart, prop drilling gone'],
  ['08-router', 'React Router, detail page, config/routes.js'],
];

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

const all = run('git for-each-ref --format="%(refname:short)" refs/heads')
  .split('\n')
  .filter(Boolean);
const current = run('git branch --show-current');
const effective = current === 'main' ? '08-router' : current;

console.log('');
for (const [name, note] of STEPS) {
  const exists = all.includes(name);
  const mark = name === effective ? '▶' : exists ? ' ' : '✗';
  const label = exists ? name : `${name} (missing)`;
  console.log(` ${mark} ${label.padEnd(26)} ${note}`);
}
console.log('');
console.log(` current: ${current || '(detached)'}`);
console.log(' usage:   git checkout 06-custom-hook && npm run dev');
console.log('');
