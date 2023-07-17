import { defineConfig } from 'vite';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'TmpUtils',
      fileName: 'tmp-utils',
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
