import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    exclude: ['**/node_modules/**', '**/test/e2e/**'],
  },
});
