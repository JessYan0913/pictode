<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Konva } from '@pictode/core';
import { useCommandComponent } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import MessageBox from '@/components/MessageBox.vue';
import usePictode from '@/hooks/usePictode';

import ContextMenu from './components/ContextMenu.vue';
import Menu from './components/Menu.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import Tools from './components/Tools.vue';

const { app, selected } = usePictode();

const canvasRef = ref<HTMLDivElement>();
const contextMenu = useCommandComponent(ContextMenu);
const clearStageMessageBox = useCommandComponent(MessageBox);

app.on('mouse:contextmenu', ({ event }) => {
  event.evt.preventDefault();
  const shapeLayerMenus = selected.value.length
    ? [
        {
          label: '上移一层',
          action: () => {
            app.moveUp(...selected.value);
          },
        },
        {
          label: '下移一层',
          action: () => {
            app.moveDown(...selected.value);
          },
        },
        {
          label: '置于顶层',
          action: () => {
            app.moveTop(...selected.value);
          },
        },
        {
          label: '置于底层',
          action: () => {
            app.moveBottom(...selected.value);
          },
        },
      ]
    : [];
  const shapeDeleteMenus = selected.value.length
    ? [
        {
          label: '删除',
        },
      ]
    : [];
  const targetIsStage = event.target instanceof Konva.Stage;
  const stageMenus =
    targetIsStage || selected.value.length === 0
      ? [
          {
            label: '全部选中',
          },
          {
            label: '重置画布',
            action: () => {
              clearStageMessageBox({
                title: '清除画布',
                message: '将会清空画布内容，是否继续？',
                onSubmit: () => {
                  app.clear();
                  clearStageMessageBox.close();
                },
              });
            },
          },
        ]
      : [];
  const historyMenus = [
    {
      label: '撤销',
      disable: !app.canUndo(),
      action: () => {
        app.undo();
      },
    },
    {
      label: '重做',
      disable: !app.canRedo(),
      action: () => {
        app.redo();
      },
    },
  ];
  const menuGroups = [stageMenus, shapeLayerMenus, historyMenus, shapeDeleteMenus];

  contextMenu({
    x: event.evt.clientX,
    y: event.evt.clientY,
    menuGroups,
  });
});

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
      <section class="row-start-1 col-start-3 justify-self-end">
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
