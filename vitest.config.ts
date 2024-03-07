import { resolve } from 'path';

import { defineConfig } from 'vitest/config';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**'],
    include: ['**/__test__/**'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@pictode/core': r('./packages/core/src'),
      '@pictode/tools': r('./packages/tools/src'),
      '@pictode/utils': r('./packages/utils/src'),
      '@pictode/vue-aide': r('./packages/vue-aide/src'),
      '@pictode/plugin-alignment': r('./packages/plugin-alignment/src'),
      '@pictode/plugin-history': r('./packages/plugin-history/src'),
      '@pictode/plugin-selector': r('./packages/plugin-selector/src'),
    },
  },
});
