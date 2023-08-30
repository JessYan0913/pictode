import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import glsl from 'vite-plugin-glsl';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_URL,
    plugins: [
      vue(),
      vueSetupExtend(),
      glsl(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/images')],
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
      }),
    ],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        { find: '@', replacement: r('./src') },
        { find: /^@pictode\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
        { find: /^@pictode\/core/, replacement: join(__dirname, '../packages/core/src/index.ts') },
        { find: /^@pictode\/plugin-history/, replacement: join(__dirname, '../packages/plugin-history/src/index.ts') },
        {
          find: /^@pictode\/plugin-selector/,
          replacement: join(__dirname, '../packages/plugin-selector/src/index.ts'),
        },
        { find: /^@pictode\/tools/, replacement: join(__dirname, '../packages/tools/src/index.ts') },
        { find: /^@pictode\/vue-aide/, replacement: join(__dirname, '../packages/vue-aide/src/index.ts') },
        { find: 'vue', replacement: join(__dirname, './node_modules/vue/dist/vue.esm-bundler.js') },
      ],
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
      host: '0.0.0.0',
      port: 8800,
      strictPort: true,
      proxy: {},
    },
  };
});
