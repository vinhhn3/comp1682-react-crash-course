import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';

/**
 * /__step → { branch }
 *
 * The concept tab asks the dev server which branch is checked out, so
 * `npm run step 5` changes the code and the explanation at the same time.
 */
function stepStatus() {
  return {
    name: 'step-status',
    configureServer(server) {
      server.middlewares.use('/__step', (req, res) => {
        let branch = 'detached';
        try {
          const head = fs.readFileSync('.git/HEAD', 'utf8').trim();
          if (head.startsWith('ref: ')) {
            branch = head.slice('ref: refs/heads/'.length);
          }
        } catch {
          /* not a git repo — leave it as detached */
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ branch }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), stepStatus()],
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
