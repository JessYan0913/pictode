<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Context, Plugin } from '@pictode/core';

const containerRef = ref<HTMLDivElement>();

class MyPlugin implements Plugin {
  public name: string = 'my-plugin';

  constructor() {
    console.log('=====>');
  }

  public install(context: Context) {
    console.log('context', context);
  }

  public dispose() {
    console.log('卸载');
  }

  public zoom() {
    console.log('zoom');
  }
}

// TODO: 插件开发参考Antv/X6
declare module '@pictode/core' {
  interface Context {
    zoom: () => void;
  }
}

Context.prototype.zoom = () => {};

const context = new Context();
const myPlugin = new MyPlugin();
context.use(myPlugin);
context.zoom();
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
