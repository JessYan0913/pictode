<script setup lang="ts">
import { computed } from 'vue';
import { injectStrict } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import {
  PictodeAppKey,
  PictodeHotKeyActionsKey,
  PictodePanelFormKey,
  PictodeSelectedKey,
} from '@/constants/inject-key';
import { Form } from '@/form';

const app = injectStrict(PictodeAppKey);
const selected = injectStrict(PictodeSelectedKey);
const { panelFormConfig, panelFormModel } = injectStrict(PictodePanelFormKey);

const {
  moveBottom,
  moveDown,
  moveUp,
  moveTop,
  alignLeft,
  alignRight,
  alignTop,
  alignBottom,
  alignCenterX,
  alignCenterY,
  distributeX,
  distributeY,
} = injectStrict(PictodeHotKeyActionsKey);

const layerButtons = computed(() => [
  {
    icon: 'bring-to-front-one',
    title: `${moveBottom.directions}-${moveBottom.hotKey?.join('+')}`,
    action: moveBottom,
  },
  {
    icon: 'sent-to-back',
    title: `${moveDown.directions}-${moveDown.hotKey?.join('+')}`,
    action: moveDown,
  },
  {
    icon: 'bring-to-front',
    title: `${moveUp.directions}-${moveUp.hotKey?.join('+')}`,
    action: moveUp,
  },
  {
    icon: 'send-to-back',
    title: `${moveTop.directions}-${moveTop.hotKey?.join('+')}`,
    action: moveTop,
  },
]);

const alignButtons = computed(() => [
  {
    icon: 'align-left',
    title: '左对齐',
    visible: selected.value.length > 1,
    action: alignLeft,
  },
  {
    icon: 'align-horizontally',
    title: '水平居中',
    visible: selected.value.length > 1,
    action: alignCenterX,
  },
  {
    icon: 'align-right',
    title: '右对齐',
    visible: selected.value.length > 1,
    action: alignRight,
  },
  {
    icon: 'distribute-horizontal-spacing',
    title: '水平分布',
    visible: selected.value.length > 2,
    action: distributeX,
  },
  {
    icon: 'align-top',
    title: '顶对齐',
    visible: selected.value.length > 1,
    action: alignTop,
  },
  {
    icon: 'align-vertically',
    title: '垂直居中',
    visible: selected.value.length > 1,
    action: alignCenterY,
  },
  {
    icon: 'align-bottom',
    title: '底对齐',
    visible: selected.value.length > 1,
    action: alignBottom,
  },
  {
    icon: 'distribute-vertical-spacing',
    title: '垂直分布',
    visible: selected.value.length > 2,
    action: distributeY,
  },
]);

const showAlignButtons = computed<boolean>(() => selected.value.length > 1);

const handleFormChange = (value: any) => {
  app.update(
    ...selected.value.map((node) => {
      const newNode = node.toObject();
      newNode.attrs = {
        ...newNode.attrs,
        ...value,
      };
      return newNode;
    })
  );
};
</script>

<template>
  <div v-if="panelFormConfig.length">
    <Form :model="panelFormModel" :config="panelFormConfig" @change="handleFormChange"></Form>
    <div v-if="showAlignButtons" class="flex flex-col content-start gap-1 px-1 py-2 select-none">
      <label class="text-start text-sm text-gray-600">对齐</label>
      <div class="flex flex-row justify-start flex-wrap gap-2">
        <div v-for="(button, index) in alignButtons" :key="index">
          <Button
            v-if="button.visible"
            class="border rounded-lg inline-flex items-center relative cursor-pointer select-none p-2 hover:bg-slate-200"
            :title="button.title"
            :icon="button.icon"
            @click="button.action"
          >
          </Button>
          <div v-else class="select-none p-2">
            <iconpark-icon></iconpark-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col content-start gap-1 px-1 py-2 select-none">
      <label class="text-start text-sm text-gray-600">图层</label>
      <div class="flex flex-row justify-start flex-wrap gap-2">
        <Button
          v-for="(button, index) in layerButtons"
          :key="index"
          class="border rounded-lg inline-flex items-center relative cursor-pointer select-none p-2 hover:bg-slate-200"
          :title="button.title"
          :icon="button.icon"
          @click="button.action"
        >
        </Button>
      </div>
    </div>
  </div>
</template>
