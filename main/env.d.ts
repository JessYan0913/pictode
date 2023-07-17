/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 环境变量
  readonly VITE_ENV: string;
  // 基础API
  readonly VITE_BASE_API: string;
  // 基础URL
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.glsl' {
  const content: string;
  export default content;
}
