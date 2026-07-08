import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        admin: resolve(__dirname, 'admin.html'),
        login: resolve(__dirname, 'login.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        register: resolve(__dirname, 'register.html'),
        team: resolve(__dirname, 'team.html'),
        team_new: resolve(__dirname, 'team_new.html'),
        terms: resolve(__dirname, 'terms.html'),
        verticals: resolve(__dirname, 'verticals.html')
      }
    }
  },
  server: {
    host: true,
    allowedHosts: true
  }
});
