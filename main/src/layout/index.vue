<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme';

import Header from './Header.vue';
import Main from './Main.vue';
import Menu from './Menu.vue';

useTheme();
</script>

<template>
  <el-container class="layout">
    <el-aside width="200px">
      <Menu />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.el-header {
  padding: 0;
}
</style>
