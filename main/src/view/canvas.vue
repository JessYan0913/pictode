<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { selectTool } from '@pictode/core';

import Button from '@/components/Button.vue';
import Menu from '@/components/Menu.vue';
import Tools from '@/components/Tools.vue';
import { Form, FormConfig } from '@/form';
import { usePictode } from '@/hooks/usePictode';

const { app } = usePictode();
app.setTool(selectTool());

const canvasRef = ref<HTMLDivElement>();

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});

const formConfig: FormConfig = [
  {
    name: 'sex',
    label: '性别',
    type: 'RadioGroup',
    options: [
      {
        text: '男',
        value: 0,
      },
      {
        text: '女',
        value: 1,
      },
    ],
  },
];
const formValue = {
  sex: 1,
};
</script>

<template>
  <div class="w-full h-full">
    <div
      class="absolute left-0 top-0 right-0 bottom-0 p-8 z-10 pointer-events-none grid grid-cols-3 grid-rows-[auto_1fr_50px] gap-12"
    >
      <section class="row-start-1 col-start-1 justify-self-start">
        <Menu class="pointer-events-auto"></Menu>
      </section>
      <section class="bg-opacity-88 row-start-1 col-start-2 justify-self-stretch">
        <Tools
          class="pointer-events-auto w-full shadow-md rounded-lg p-2 ring-1 ring-black ring-opacity-5 transition-shadow"
        ></Tools>
      </section>
      <section class="bg-opacity-88 row-start-1 col-start-3 justify-self-end">
        <div
          class="grid grid-flow-col gap-4 w-full pointer-events-auto shadow-md rounded-lg p-2 ring-1 ring-black ring-opacity-5 transition-shadow"
        >
          <Button class="w-8 h-8" icon="undo" @click="app.undo()"></Button>
          <Button class="w-8 h-8" icon="redo" @click="app.redo()"></Button>
        </div>
      </section>
      <section class="bg-opacity-88 row-start-2 col-start-3 justify-self-end">
        <Form
          class="p-4 w-56 shadow-md rounded-lg ring-1 ring-black ring-opacity-5 transition-shadow pointer-events-auto"
          :config="formConfig"
          :model-value="formValue"
          label-position="top"
        ></Form>
      </section>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
