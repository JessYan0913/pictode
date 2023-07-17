import { RouteRecordRaw } from 'vue-router';

import { routes } from '@/router';
import type { Menu } from '@/structure';

export const useMenus = () => {
  return routes2Menus(routes);

  function routes2Menus(routes: RouteRecordRaw[]): Menu[] {
    return routes.reduce<Menu[]>((menuList, route) => {
      if (route.meta?.menu) {
        const menu: Menu = {
          title: typeof route.meta.menu === 'boolean' ? route.name?.toString() ?? '' : route.meta.menu,
          index: route.path,
        };
        if (route.children) {
          menu.children = routes2Menus(route.children);
        }
        menuList.push(menu);
      }
      return menuList;
    }, []);
  }
};

export default useMenus;
