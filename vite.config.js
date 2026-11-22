import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

/**
 * Two tiny endpoints for the concept tab:
 *   /__step        → which branch is checked out
 *   /__diff?step=N → git diff between step N and step N-1 (defaults to the current step)
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

function branchFor(n) {
  const prefix = `s${String(n).padStart(2, '0')}-`;
  return git(`git branch --list "${prefix}*" --format="%(refname:short)"`).split('\n')[0];
}

function send(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function stepEndpoints() {
  return {
    name: 'step-endpoints',
    configureServer(server) {
      server.middlewares.use('/__step', (req, res) => {
        send(res, { branch: readBranch() });
      });

      server.middlewares.use('/__diff', (req, res) => {
        const requested = new URL(req.url, 'http://localhost').searchParams.get('step');
        const branch = readBranch();

        let n;
        let to;

        if (requested !== null) {
          n = Number(requested);
          to = branchFor(n);
        } else {
          to = branch === 'main' ? 's16-router' : branch;
          const match = to.match(/^s(\d\d)-/);
          n = match ? Number(match[1]) : NaN;
        }

        const from = Number.isInteger(n) && n > 0 ? branchFor(n - 1) : '';
        const raw = from ? git(`git diff --no-color -M ${from} ${to} -- src`) : '';
        const stat = from ? git(`git diff --stat -M ${from} ${to} -- src`) : '';

        send(res, { from, to, raw, stat });
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
