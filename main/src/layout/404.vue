<script lang="ts" setup>
import img from '@/assets/img/404.svg';
</script>

<template>
  <div class="wrapper">
    <img :src="img" />
    <h2>页面不存在</h2>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.wrapper img {
  height: 480px;
}
</style>
