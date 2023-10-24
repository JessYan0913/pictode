import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import { useRouterCache } from '@/hooks/useRouterCache';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Canvas',
    component: () => import('../view/canvas/index.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../view/about/index.vue'),
  },
  {
    path: '/model',
    name: 'model',
    component: () => import('../view/model/model.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/canvas',
      component: () => import('../layout/index.vue'),
      children: routes,
    },
  ],
});

const { cacheRouter } = useRouterCache();
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  cacheRouter(from, to);
  next();
});

export default router;
