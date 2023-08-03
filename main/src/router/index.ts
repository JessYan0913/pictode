import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import useRoutersStore from '@/store/routers';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Canvas',
    component: () => import('../view/canvas/index.vue'),
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
    {
      path: '/404',
      name: '404',
      component: () => import('../layout/404.vue'),
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404',
    },
  ],
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { cacheRouter } = useRoutersStore();
  cacheRouter(from, to);
  next();
});

export default router;
