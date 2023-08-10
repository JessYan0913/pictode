<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { selectTool } from '@pictode/core';

import Button from '@/components/Button.vue';
import Property from '@/components/Property.vue';
import Tools from '@/components/Tools.vue';
import { usePictode } from '@/hooks/usePictode';

const { app } = usePictode();
app.setTool(selectTool());

const canvasRef = ref<HTMLDivElement>();
const propertyVisible = ref<boolean>(false);

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});
</script>

<template>
  <div class="w-full h-full">
    <div class="absolute left-4 top-4 right-4 bottom-4 p-4 z-10 pointer-events-none">
      <div class="grid grid-cols-3 gap-12 items-start cursor-default pointer-events-none font-AlimamaFangYuanTi">
        <div class="justify-self-start grid gap-1.5 grid-cols-1 grid-flow-row auto-rows-min pointer-events-auto">
          <div
            class="flex justify-center items-center p-2 cursor-pointer text-3xl w-9 h-9 select-none"
            @click="propertyVisible = !propertyVisible"
          >
            🎨
          </div>
          <div
            v-if="propertyVisible"
            class="bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow w-202 max-h-667"
          >
            <Property></Property>
          </div>
        </div>
        <section
          class="bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow flex justify-center pointer-events-none"
        >
          <Tools class="pointer-events-auto"></Tools>
        </section>
        <div class="justify-self-end bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow">
          <div class="grid grid-flow-col gap-4 mx-1 pointer-events-auto">
            <Button class="w-9 h-9" icon="undo" @click="app.undo()"></Button>
            <Button class="w-9 h-9" icon="redo" @click="app.redo()"></Button>
          </div>
        </div>
      </div>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
