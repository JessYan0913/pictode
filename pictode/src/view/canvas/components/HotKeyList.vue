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
      class="w-full min-w-fit md:min-w-[60rem] h-[50rem] overflow-auto scrollbar scrollbar-thumb-gray-200 scrollbar-track-gray-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg"
    >
      <h3 class="my-4 text-xl font-bold">快捷键列表</h3>
      <div class="grid grid-flow-row auto-rows-auto gap-4 p-2">
        <div>
          <h4 class="my-4 text-lg font-bold">工具</h4>
          <div class="border rounded-lg divide-y">
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="my-4 text-lg font-bold">编辑器</h4>
          <div class="border rounded-lg divide-y">
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="my-4 text-lg font-bold">画布</h4>
          <div class="border rounded-lg divide-y">
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
            <div class="p-4 flex flex-row justify-between items-center text-sm">
              <div>选择</div>
              <div class="justify-self-end">
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
                或
                <i class="p-2 bg-blue-100 rounded-lg">H</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
