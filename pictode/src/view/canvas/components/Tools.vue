<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import { Tool, util } from '@pictode/core';
import {
  ArrowTool,
  DiamondTool, 
  main
  DrawingTool,
  EllipseTool,
  EraserTool,
  ImageTool,
  LineTool,
  RectTool,
  RegularPolygonTool,
  SelectTool,
  TextTool,
} from '@pictode/tools';
import { injectStrict } from '@pictode/vue-aide';

import round from '@/assets/images/round.svg';
import { PictodeAppKey } from '@/constants/inject-key';
import useTheme from '@/hooks/useTheme';

const app = injectStrict(PictodeAppKey);

interface ToolInfo {
  icon: string;
  name: string;
  title: string;
  tool: Tool | (() => Tool | Promise<Tool>);
}

const selectTool = new SelectTool({
  hooks: {
    onActive(app) {
      app.getPlugin('selectorPlugin')?.enable?.();
    },
    onInactive(app) {
      app.getPlugin('selectorPlugin')?.disable?.();
    },
  },
});

const tools: ToolInfo[] = [
  {
    icon: 'move',
    name: 'selectTool',
    title: '选择',
    tool: selectTool,
  },
  {
    icon: 'rectangle',
    name: 'rectTool',
    title: '矩形',
    tool: () =>
      new RectTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'oval',
    name: 'ellipseTool',
    title: '椭圆',
    tool: () =>
      new EllipseTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'diamond',
    name: 'diamondTool',
    title: '菱形',
    tool: () =>
      new RegularPolygonTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'line-1',
    name: 'lineTool',
    title: '线条',
    tool: () =>
      new LineTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'pencil',
    name: 'drawingTool',
    title: '自由书写',
    tool: () =>
      new DrawingTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
        },
      }),
  },
  {
    icon: 'line-2',
    name: 'arrowTool',
    title: '箭头',
    tool: () =>
      new ArrowTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
        },
      }),
  },
  {
    icon: 'picture',
    name: 'imageTool',
    title: '图片',
    tool: async () => {
      const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
      const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
      const image = new Image();
      image.src = imgSrc;
      return new ImageTool({
        config: {
          image,
        },
        hooks: {
          onActive(app) {
            app.cancelSelect();
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      });
    },
  },
  {
    icon: 'text',
    name: 'textTool',
    title: '文本',
    tool: () =>
      new TextTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = 'crosshair';
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
          onCompleteDrawing(app, node) {
            currentTool.value = selectTool.name;
            nextTick(() => app.select(node));
          },
        },
      }),
  },
  {
    icon: 'eraser',
    name: 'eraserTool',
    title: '橡皮擦',
    tool: () =>
      new EraserTool({
        hooks: {
          onActive(app) {
            app.containerElement.style.cursor = `url(${round}), auto`;
          },
          onInactive(app) {
            app.containerElement.style.cursor = `default`;
          },
        },
      }),
  },
];

const currentTool = ref<string>(tools[0].name);
const { theme } = useTheme();
const strokeColor = computed<string>(() => (theme.value === 'dark' ? '#d1d5db' : '#333333'));

watchEffect(async () => {
  let tool = tools.find(({ name }) => name === currentTool.value)?.tool;
  if (typeof tool === 'function') {
    tool = await tool();
  }
  if (tool) {
    app.setTool(tool);
  }
});
</script>

<template>
  <RadioGroup v-model="currentTool">
    <div class="flex flex-grow justify-around flex-wrap">
      <RadioGroupOption v-for="(item, index) in tools" :key="index" :value="item.name" :title="$t(item.title)">
        <template #default="{ checked }">
          <div
            :class="[
              'rounded-lg inline-flex items-center relative cursor-pointer select-none p-2',
              checked ? 'bg-blue-500' : 'hover:bg-gray-200 dark:hover:bg-navyBlue-100',
            ]"
          >
            <iconpark-icon :name="item.icon" :stroke="strokeColor"></iconpark-icon>
          </div>
        </template>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
