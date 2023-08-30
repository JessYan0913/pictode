<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import Button from '@/components/Button.vue';
import useContextMenu from '@/hooks/useContextMenu';
import usePictode from '@/hooks/usePictode';

import Menu from './components/Menu.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import Tools from './components/Tools.vue';

const { app, selected, scale } = usePictode();

useContextMenu(app, selected);

const canvasRef = ref<HTMLDivElement>();

const displayScale = computed<string>(() => {
  return `${Math.ceil(scale.value * 100)}%`;
});

const onClickZoomIn = () => {
  app.scaleTo(scale.value + app.config.mousewheel.factor);
};

const onClickZoomOut = () => {
  app.scaleTo(scale.value - app.config.mousewheel.factor);
};

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});
</script>

<template>
  <div class="w-full h-full">
    <div
      class="absolute left-0 top-0 right-0 bottom-0 p-8 z-10 pointer-events-none grid grid-cols-3 grid-rows-[auto_1fr_50px] gap-12"
    >
      <section class="row-start-1 col-start-1 justify-self-start">
        <Menu class="pointer-events-auto"></Menu>
      </section>
      <section class="row-start-1 col-start-2 justify-self-stretch">
        <Tools
          class="pointer-events-auto w-full shadow-md rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        ></Tools>
      </section>
      <section class="row-start-1 col-start-3 justify-self-end flex flex-row gap-2">
        <div
          class="grid grid-flow-col gap-4 w-full pointer-events-auto shadow-md rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        >
          <Button class="w-8 h-8" icon="minus" @click="onClickZoomOut"></Button>
          <div class="flex text-center text-sm h-full items-center select-none">{{ displayScale }}</div>
          <Button class="w-8 h-8" icon="plus" @click="onClickZoomIn"></Button>
        </div>
        <div
          class="grid grid-flow-col gap-4 w-full pointer-events-auto shadow-md rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        >
          <Button class="w-8 h-8" icon="undo" @click="app.undo()"></Button>
          <Button class="w-8 h-8" icon="redo" @click="app.redo()"></Button>
        </div>
      </section>
      <section class="row-start-2 col-start-3 justify-self-end">
        <PropertyPanel
          class="p-4 w-56 shadow-md rounded-lg ring-1 ring-black bg-white ring-opacity-5 transition-shadow pointer-events-auto"
        ></PropertyPanel>
      </section>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
