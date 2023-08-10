<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { selectTool } from '@pictode/core';

import Button from '@/components/Button.vue';
import Menu from '@/components/Menu.vue';
import Tools from '@/components/Tools.vue';
import { usePictode } from '@/hooks/usePictode';

const { app } = usePictode();
app.setTool(selectTool());

const canvasRef = ref<HTMLDivElement>();

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});
</script>

<template>
  <div class="w-full h-full">
    <div class="absolute left-0 top-0 right-0 bottom-0 p-10 z-10 pointer-events-none">
      <div class="grid grid-cols-3 gap-12 items-start cursor-default pointer-events-none font-AlimamaFangYuanTi">
        <section class="justify-self-start pointer-events-auto">
          <Menu></Menu>
        </section>
        <section
          class="justify-center bg-opacity-88 shadow-md rounded-lg p-2 ring-1 ring-black ring-opacity-5 transition-shadow"
        >
          <Tools class="pointer-events-auto w-full"></Tools>
        </section>
        <section
          class="justify-self-end bg-opacity-88 shadow-md rounded-lg p-2 ring-1 ring-black ring-opacity-5 transition-shadow"
        >
          <div class="grid grid-flow-col gap-4 w-full pointer-events-auto">
            <Button class="w-8 h-8" icon="undo" @click="app.undo()"></Button>
            <Button class="w-8 h-8" icon="redo" @click="app.redo()"></Button>
          </div>
        </section>
      </div>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
