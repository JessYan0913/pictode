<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Context } from '@pictode/core';

const containerRef = ref<HTMLDivElement>();

const context = new Context();
onMounted(() => {
  if (containerRef.value) {
    context.mount(containerRef.value);
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
