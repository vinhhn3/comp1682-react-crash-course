#!/usr/bin/env node
/** Open the concept tab once. After that it follows the branch by itself. */
import { execSync } from 'node:child_process';

const url = 'http://localhost:5173/concepts/step.html';
const open =
  process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';

try {
  execSync(`${open} "${url}"`);
} catch {
  console.log(`Open this in your browser: ${url}`);
}
