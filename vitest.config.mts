import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/node_modules/**', '**/.git/**', '**/.worktrees/**', '**/dist/**']
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }
  }
});
