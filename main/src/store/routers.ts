import { RouteLocationNormalized } from 'vue-router';
import { defineStore, StoreDefinition } from 'pinia';

export interface RoutersState {
  cacheComps: Set<string>;
}

export interface RoutersGetters {
  keepAliveComps: (state: RoutersState) => string[];
}

export interface RoutersActions {
  cacheRouter: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void;
}

export type RoutersStoreDefinition = StoreDefinition<string, RoutersState, RoutersGetters, RoutersActions>;

export const useRoutersStore: RoutersStoreDefinition = defineStore('routers', {
  state: (): RoutersState => ({
    cacheComps: new Set(),
  }),
  getters: {
    keepAliveComps: (state: RoutersState) => [...state.cacheComps],
  },
  actions: {
    cacheRouter(from: RouteLocationNormalized, to: RouteLocationNormalized) {
      if (
        Array.isArray(from.meta.leaveCaches) &&
        from.meta.leaveCaches.includes(to.path) &&
        typeof from.name === 'string'
      ) {
        this.cacheComps.add(from.name);
      }
      if (
        Array.isArray(to.meta.leaveCaches) &&
        !to.meta.leaveCaches.includes(from.path) &&
        typeof to.name === 'string'
      ) {
        this.cacheComps.delete(to.name);
      }
    },
  },
});

export default useRoutersStore;
