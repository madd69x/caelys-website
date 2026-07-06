import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths for assets on GitHub Pages
  server: {
    host: true, // Listen on all local IPs
    allowedHosts: true // Allow all host headers (solves localtunnel issues)
  }
});
