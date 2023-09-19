<script setup lang="ts">
import { computed } from 'vue';
import { injectStrict } from '@pictode/vue-aide';

import Dialog from '@/components/Dialog.vue';
import { PictodeAppKey, PictodeSelectedKey } from '@/constants/inject-key';
import useHotKeyList from '@/hooks/useHotKeyList';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const app = injectStrict(PictodeAppKey);
const selected = injectStrict(PictodeSelectedKey);

const { moveUp, moveBottom, moveTop, moveDown, undo, redo, makeGroup, decomposeGroup } = useHotKeyList(app, selected);

const hotKeyListMack = [
  {
    title: '编辑',
    hotKeyList: [
      {
        title: undo.directions,
        hotKey: undo.hotKey,
      },
      {
        title: redo.directions,
        hotKey: redo.hotKey,
      },
    ],
  },
  {
    title: '转换',
    hotKeyList: [
      {
        title: moveTop.directions,
        hotKey: moveTop.hotKey,
      },
      {
        title: moveUp.directions,
        hotKey: moveUp.hotKey,
      },
      {
        title: moveDown.directions,
        hotKey: moveDown.hotKey,
      },
      {
        title: moveBottom.directions,
        hotKey: moveBottom.hotKey,
      },
      {
        title: makeGroup.directions,
        hotKey: makeGroup.hotKey,
      },
      {
        title: decomposeGroup.directions,
        hotKey: decomposeGroup.hotKey,
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
      class="w-full min-w-fit md:min-w-[60rem] h-[40rem] p-2 overflow-auto scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100"
    >
      <h3 class="my-4 text-xl font-bold">快捷键列表</h3>
      <div class="columns-2 gap-8">
        <div
          v-for="({ title, hotKeyList }, index) in hotKeyListMack"
          :key="index"
          class="w-full break-inside-avoid-column pb-4"
        >
          <h3 class="font-bold text-base my-2">{{ title }}</h3>
          <div class="border rounded-lg divide-y">
            <div
              v-for="({ title, hotKey }, index) in hotKeyList"
              :key="index"
              class="w-full p-4 flex flex-row justify-between items-center text-xs"
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
