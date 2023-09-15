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

const hotKeyList = useHotKeyList(app, selected);

console.log('===>', hotKeyList);

const hotKeyListMack = [
  {
    title: '工具',
    hotKeyList: [
      {
        title: '选择',
        hotKey: 'V',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '菱形',
        hotKey: 'D',
      },
    ],
  },
  {
    title: '编辑',
    hotKeyList: [
      {
        title: '选择',
        hotKey: 'V',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
    ],
  },
  {
    title: '编辑',
    hotKeyList: [
      {
        title: '选择',
        hotKey: 'V',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
    ],
  },
  {
    title: '编辑',
    hotKeyList: [
      {
        title: '选择',
        hotKey: 'V',
      },
      {
        title: '矩形',
        hotKey: 'R',
      },
    ],
  },
  {
    title: '编辑',
    hotKeyList: [
      {
        title: '选择',
        hotKey: 'V',
      },
      {
        title: '矩形',
        hotKey: 'R',
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
      class="w-full min-w-fit md:min-w-[60rem] h-[40rem] p-4 overflow-auto scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100"
    >
      <h3 class="my-4 text-xl font-bold">快捷键列表</h3>
      <div class="columns-2 gap-8">
        <div
          v-for="({ title, hotKeyList }, index) in hotKeyListMack"
          :key="index"
          class="w-full break-inside-avoid-column pb-4"
        >
          <h2 class="font-bold text-base">{{ title }}</h2>
          <div class="border rounded-lg divide-y">
            <div
              v-for="({ title, hotKey }, index) in hotKeyList"
              :key="index"
              class="w-full p-4 flex flex-row justify-between items-center text-sm"
            >
              <div>{{ title }}</div>
              <div class="justify-self-end">
                <i class="w-7 p-2 bg-blue-100 rounded-lg">{{ hotKey }}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
