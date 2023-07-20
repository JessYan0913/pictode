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
  <div ref="containerRef" class="container"></div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
