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
          class="bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow flex justify-center pointer-events-none"
        >
          <Tools class="pointer-events-auto w-full"></Tools>
        </section>
        <div class="justify-self-end bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow">
          <div class="grid grid-flow-col gap-4 w-full pointer-events-auto">
            <Button class="w-9 h-9" icon="undo" @click="app.undo()"></Button>
            <Button class="w-9 h-9" icon="redo" @click="app.redo()"></Button>
          </div>
        </div>
      </div>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
