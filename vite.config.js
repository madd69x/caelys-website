import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        team_new: '', privacy: '', register: '', team: '', admin: '', verticals: '', index: '', terms: '', about: '', login: ''
      }
    }
  },
  server: {
    host: true,
    allowedHosts: true
  }
});
