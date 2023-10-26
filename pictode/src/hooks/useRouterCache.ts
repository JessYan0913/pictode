import { computed, ref } from 'vue';
import { RouteLocationNormalized } from 'vue-router';

const cacheComps = ref<Set<string>>(new Set());

export const useRouterCache = () => {
  const keepAliveComps = computed<Array<string>>(() => [...cacheComps.value]);
  const cacheRouter = (from: RouteLocationNormalized, to: RouteLocationNormalized) => {
    if (
      Array.isArray(from.meta.leaveCaches) &&
      from.meta.leaveCaches.includes(to.path) &&
      typeof from.name === 'string'
    ) {
      cacheComps.value.add(from.name);
    }
    if (Array.isArray(to.meta.leaveCaches) && !to.meta.leaveCaches.includes(from.path) && typeof to.name === 'string') {
      cacheComps.value.delete(to.name);
    }
  };
  return { keepAliveComps, cacheRouter };
};

export default useRouterCache;
