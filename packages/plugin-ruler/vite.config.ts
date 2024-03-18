import { join } from 'path';

import { defineConfig } from 'vite';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@pictode\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
      { find: /^@pictode\/core/, replacement: join(__dirname, '../packages/core/src/index.ts') },
    ],
  },
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'PictodePluginRuler',
      fileName: 'pictode-plugin-ruler',
    },
    rollupOptions: {
      external(id: string) {
        return deps.some((k) => new RegExp(`^${k}`).test(id));
      },
      output: {
        globals: {
          axios: 'axios',
        },
      },
    },
  },
});
