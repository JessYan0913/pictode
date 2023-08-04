<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme';

import Main from './Main.vue';

useTheme();
</script>

<template>
  <el-container class="layout">
    <el-main>
      <Main />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.el-main {
  padding: 0;
}
</style>
