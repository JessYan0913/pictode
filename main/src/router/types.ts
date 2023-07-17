import 'vue-router';

export type LeaveCaches = string[];

declare module 'vue-router' {
  interface RouteMeta {
    leaveCaches?: LeaveCaches;
    menu?: boolean | string;
  }
}
