import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**'],
    include: ['./packages/**/tests/**'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@pictode/utils': r('./packages/utils/src'),
    },
  },
});
