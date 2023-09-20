<script setup lang="ts">
import { computed } from 'vue';
import { HotKeyFunction, injectStrict } from '@pictode/vue-aide';

import Dialog from '@/components/Dialog.vue';
import { PictodeHotKeyActionsKey } from '@/constants/inject-key';
import { hotKey2Array } from '@/utils';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const {
  undo,
  redo,
  deleteNode,
  selectAll,
  resetStage,
  stageDrag,
  mouseWheel,
  moveUp,
  moveBottom,
  moveTop,
  moveDown,
  makeGroup,
  decomposeGroup,
  alignBottom,
  alignLeft,
  alignCenterX,
  alignCenterY,
  alignRight,
  alignTop,
  distributeX,
  distributeY,
} = injectStrict(PictodeHotKeyActionsKey);

const hotKeyListMack: Array<{
  title: string;
  hotKeyList: Array<HotKeyFunction>;
}> = [
  {
    title: '编辑',
    hotKeyList: [undo, redo, selectAll, deleteNode, resetStage],
  },
  {
    title: '视图',
    hotKeyList: [stageDrag, mouseWheel],
  },
  {
    title: '转换',
    hotKeyList: [
      moveTop,
      moveUp,
      moveDown,
      moveBottom,
      makeGroup,
      decomposeGroup,
      alignLeft,
      alignCenterX,
      alignRight,
      alignTop,
      alignCenterY,
      alignBottom,
      distributeX,
      distributeY,
    ],
  },
];

const dialogVisible = computed<boolean>({
  get() {
    return props.visible;
  },
  set(visible: boolean) {
    emits('update:visible', visible);
    if (!visible) {
      emits('close');
    }
  },
});

const closeModal = () => {
  dialogVisible.value = false;
};
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <template #title> {{ $t('帮助中心') }} </template>
    <div
      class="w-full min-w-fit md:min-w-[60rem] h-[40rem] p-2 overflow-auto scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-gray-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg"
    >
      <h3 class="my-4 text-xl font-bold">{{ $t('快捷键列表') }}</h3>
      <div class="columns-2 gap-8">
        <div
          v-for="({ title, hotKeyList }, index) in hotKeyListMack"
          :key="index"
          class="w-full break-inside-avoid-column pb-4"
        >
          <h3 class="font-bold text-base">{{ $t(title) }}</h3>
          <div
            class="rounded-lg ring-1 ring-slate-950 dark:ring-navyBlue-100 divide-y divide-slate-950 dark:divide-navyBlue-100 mt-2 text-xs"
          >
            <div
              v-for="(hotkeyFunction, index) in hotKeyList"
              :key="index"
              class="w-full p-4 flex flex-row justify-between items-center"
            >
              <div>{{ $t(hotkeyFunction.directions ?? '') }}</div>
              <div class="justify-self-end flex flex-row gap-1">
                <i
                  v-for="(key, index) in hotKey2Array(hotkeyFunction.hotKey)"
                  :key="index"
                  class="p-2 min-w-fit bg-blue-100 rounded-lg dark:text-gray-600"
                >
                  {{ key }}
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
