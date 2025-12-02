import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],

  server: {
    port: 80,
    host: true,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
	include: ['src/test/**/*.test.tsx'],
  },
});
