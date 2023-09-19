<script setup lang="ts">
import { computed } from 'vue';
import { injectStrict } from '@pictode/vue-aide';

import Dialog from '@/components/Dialog.vue';
import { PictodeHotKeyActionsKey } from '@/constants/inject-key';

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

const hotKeyFactory = (keys: (string | string[])[] = []): (string | undefined)[] => {
  function capitalize(str: string): string {
    return str === ' ' ? 'Space' : str.charAt(0).toUpperCase() + str.slice(1);
  }

  function processItem(item: string | string[]) {
    if (typeof item === 'string') {
      return capitalize(item);
    } else if (Array.isArray(item)) {
      return item.map((subItem) => capitalize(subItem)).join(' / ');
    }
  }

  if (Array.isArray(keys)) {
    return keys.map((item) => processItem(item));
  }

  return [capitalize(keys)];
};

const hotKeyListMack: Array<{
  title: string;
  hotKeyList: Array<{ title?: string; hotKey: (string | undefined)[] }>;
}> = [
  {
    title: '编辑',
    hotKeyList: [
      {
        title: undo.directions,
        hotKey: hotKeyFactory(undo.hotKey),
      },
      {
        title: redo.directions,
        hotKey: hotKeyFactory(redo.hotKey),
      },
      {
        title: selectAll.directions,
        hotKey: hotKeyFactory(selectAll.hotKey),
      },
      {
        title: deleteNode.directions,
        hotKey: hotKeyFactory(deleteNode.hotKey),
      },
      {
        title: resetStage.directions,
        hotKey: hotKeyFactory(resetStage.hotKey),
      },
    ],
  },
  {
    title: '视图',
    hotKeyList: [
      {
        title: stageDrag.directions,
        hotKey: hotKeyFactory(stageDrag.hotKey),
      },
      {
        title: mouseWheel.directions,
        hotKey: hotKeyFactory(mouseWheel.hotKey),
      },
    ],
  },
  {
    title: '转换',
    hotKeyList: [
      {
        title: moveTop.directions,
        hotKey: hotKeyFactory(moveTop.hotKey),
      },
      {
        title: moveUp.directions,
        hotKey: hotKeyFactory(moveUp.hotKey),
      },
      {
        title: moveDown.directions,
        hotKey: hotKeyFactory(moveDown.hotKey),
      },
      {
        title: moveBottom.directions,
        hotKey: hotKeyFactory(moveBottom.hotKey),
      },
      {
        title: makeGroup.directions,
        hotKey: hotKeyFactory(makeGroup.hotKey),
      },
      {
        title: decomposeGroup.directions,
        hotKey: hotKeyFactory(decomposeGroup.hotKey),
      },
      {
        title: alignLeft.directions,
        hotKey: hotKeyFactory(alignLeft.hotKey),
      },
      {
        title: alignCenterX.directions,
        hotKey: hotKeyFactory(alignCenterX.hotKey),
      },
      {
        title: alignRight.directions,
        hotKey: hotKeyFactory(alignRight.hotKey),
      },
      {
        title: alignTop.directions,
        hotKey: hotKeyFactory(alignTop.hotKey),
      },
      {
        title: alignCenterY.directions,
        hotKey: hotKeyFactory(alignCenterY.hotKey),
      },
      {
        title: alignBottom.directions,
        hotKey: hotKeyFactory(alignBottom.hotKey),
      },
      {
        title: distributeX.directions,
        hotKey: hotKeyFactory(distributeX.hotKey),
      },
      {
        title: distributeY.directions,
        hotKey: hotKeyFactory(distributeY.hotKey),
      },
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
    <template #title> 帮助中心 </template>
    <div
      class="w-full min-w-fit md:min-w-[60rem] h-[40rem] p-2 overflow-auto scrollbar scrollbar-w-2 scrollbar-thumb-gray-200 scrollbar-track-gray-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg"
    >
      <h3 class="my-4 text-xl font-bold">快捷键列表</h3>
      <div class="columns-2 gap-8">
        <div
          v-for="({ title, hotKeyList }, index) in hotKeyListMack"
          :key="index"
          class="w-full break-inside-avoid-column pb-4"
        >
          <h3 class="font-bold text-base">{{ title }}</h3>
          <div class="border rounded-lg divide-y mt-2 text-xs">
            <div
              v-for="({ title, hotKey }, index) in hotKeyList"
              :key="index"
              class="w-full p-4 flex flex-row justify-between items-center"
            >
              <div>{{ title }}</div>
              <div class="justify-self-end flex flex-row gap-1">
                <i v-for="(key, index) in hotKey" :key="index" class="p-2 min-w-fit bg-blue-100 rounded-lg">
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
