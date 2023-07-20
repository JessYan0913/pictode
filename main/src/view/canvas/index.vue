<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { App } from '@pictode/core';

const containerRef = ref<HTMLDivElement>();

const app = new App();
onMounted(() => {
  if (containerRef.value) {
    app.mount(containerRef.value);
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="tools">
      <button @click="app.setModel('select')">选择🖱️</button>
      <button @click="app.setModel('drawing')">铅笔✏️</button>
    </div>
    <div ref="containerRef" class="container"></div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tools {
  height: 30px;
}

.container {
  flex: 1;
}
</style>
