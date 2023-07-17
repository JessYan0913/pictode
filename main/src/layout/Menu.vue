<script setup lang="ts">
import { useMenus } from '@/hooks/useMenus';

const menus = useMenus();
</script>

<template>
  <el-menu class="menu" mode="vertical" router>
    <template v-for="menu in menus">
      <el-sub-menu v-if="menu.children" :key="menu.index" :index="menu.index">
        <template #title>{{ menu.title }}</template>
        <el-menu-item v-for="childMenu in menu.children" :key="childMenu.index" :index="childMenu.index">
          {{ childMenu.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :key="`${menu.index}-false`" :index="menu.index">
        {{ menu.title }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>
.menu {
  height: 100%;
  background-color: #3282b8;
}
</style>
