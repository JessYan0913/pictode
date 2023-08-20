<script setup lang="ts">
import { computed, ref } from 'vue';

import Dialog from '@/components/Dailog.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import Switch from '@/components/Switch.vue';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

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

const enabled = ref<boolean>(false);
const pixelRatio = ref<number>(2);

function closeModal() {
  dialogVisible.value = false;
}
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <div class="flex items-center h-96 w-[50%]">
      <div
        class="w-full h-full flex flex-grow justify-center bg-fixed rounded-md p-1"
        style="
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);
        "
      ></div>
    </div>
    <div class="flex flex-col flex-wrap gap-6 grow ml-6 antialiased">
      <div class="text-lg">导出图片</div>
      <div class="flex flex-row justify-between items-center">
        <label>背景</label>
        <Switch v-model="enabled"></Switch>
      </div>
      <div class="flex flex-row justify-between items-center">
        <label>缩放比</label>
        <RadioGroup v-model="pixelRatio" class="rounded ring-1 ring-black ring-opacity-5 p-0.5">
          <RadioGroupOption :value="1" class="font-mono text-xs">{{ '1x' }}</RadioGroupOption>
          <RadioGroupOption :value="2" class="font-mono text-xs">{{ '2x' }}</RadioGroupOption>
          <RadioGroupOption :value="3" class="font-mono text-xs">{{ '3x' }}</RadioGroupOption>
        </RadioGroup>
      </div>
      <div class="grow flex flex-col justify-end">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          下载
        </button>
      </div>
    </div>
  </Dialog>
</template>
