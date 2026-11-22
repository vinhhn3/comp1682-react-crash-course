import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

/**
 * Two tiny endpoints for the concept tab:
 *   /__step → { branch }        which step is checked out
 *   /__diff → { from, to, … }   git diff between this step and the previous one
 */
function git(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function readBranch() {
  try {
    const head = fs.readFileSync('.git/HEAD', 'utf8').trim();
    return head.startsWith('ref: ') ? head.slice('ref: refs/heads/'.length) : 'detached';
  } catch {
    return 'detached';
  }
}

function stepEndpoints() {
  return {
    name: 'step-endpoints',
    configureServer(server) {
      server.middlewares.use('/__step', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ branch: readBranch() }));
      });

      server.middlewares.use('/__diff', (req, res) => {
        const branch = readBranch();
        const to = branch === 'main' ? 's16-router' : branch;
        const match = to.match(/^s(\d\d)-/);
        const n = match ? Number(match[1]) : NaN;

        let from = '';
        if (!Number.isNaN(n) && n > 0) {
          const prefix = `s${String(n - 1).padStart(2, '0')}-`;
          from = git(`git branch --list "${prefix}*" --format="%(refname:short)"`).split('\n')[0];
        }

        const raw = from ? git(`git diff --no-color -M ${from} ${to} -- src`) : '';
        const stat = from ? git(`git diff --stat -M ${from} ${to} -- src`) : '';

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ from, to, raw, stat }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), stepEndpoints()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
