<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { App } from '@pictode/core';
import { History } from '@pictode/plugin-history';

const containerRef = ref<HTMLDivElement>();

const history = new History();

const app = new App();
app.use(history);
app.undo();
onMounted(() => {
  if (containerRef.value) {
    app.mount(containerRef.value);
  }
});
</script>

<template>
  <h1>canvas</h1>
  <div ref="containerRef" class="container"></div>
</template>

<style scoped lang="scss">
.container {
  width: 500px;
  height: 500px;
}
</style>
