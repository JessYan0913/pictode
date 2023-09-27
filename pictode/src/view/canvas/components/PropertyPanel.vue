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
    action: moveBottom,
  },
  {
    icon: 'sent-to-back',
    action: moveDown,
  },
  {
    icon: 'bring-to-front',
    action: moveUp,
  },
  {
    icon: 'send-to-back',
    action: moveTop,
  },
]);

const alignButtons = computed(() => [
  {
    icon: 'align-left',
    visible: selected.value.length > 1,
    action: alignLeft,
  },
  {
    icon: 'align-horizontally',
    visible: selected.value.length > 1,
    action: alignCenterX,
  },
  {
    icon: 'align-right',
    visible: selected.value.length > 1,
    action: alignRight,
  },
  {
    icon: 'distribute-horizontal-spacing',
    visible: selected.value.length > 2,
    action: distributeX,
  },
  {
    icon: 'align-top',
    visible: selected.value.length > 1,
    action: alignTop,
  },
  {
    icon: 'align-vertically',
    visible: selected.value.length > 1,
    action: alignCenterY,
  },
  {
    icon: 'align-bottom',
    visible: selected.value.length > 1,
    action: alignBottom,
  },
  {
    icon: 'distribute-vertical-spacing',
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
      <label class="text-start text-sm text-gray-600 dark:text-gray-300">{{ $t('对齐') }}</label>
      <div class="flex flex-row justify-start flex-wrap gap-2">
        <div v-for="(button, index) in alignButtons" :key="index">
          <Button
            v-if="button.visible"
            class="rounded-lg inline-flex items-center relative cursor-pointer select-none p-2 hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
            :title="$t(button.action.directions ?? '')"
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
      <label class="text-start text-sm text-gray-600 dark:text-gray-300">{{ $t('层级') }}</label>
      <div class="flex flex-row justify-start flex-wrap gap-2">
        <Button
          v-for="(button, index) in layerButtons"
          :key="index"
          class="rounded-lg inline-flex items-center relative cursor-pointer select-none p-2 hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
          :title="$t(button.action.directions ?? '')"
          :icon="button.icon"
          @click="button.action"
        >
        </Button>
      </div>
    </div>
  </div>
</template>
