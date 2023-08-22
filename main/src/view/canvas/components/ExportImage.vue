<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import Dialog from '@/components/Dailog.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import Select from '@/components/Select.vue';
import SelectOption from '@/components/SelectOption.vue';
import Switch from '@/components/Switch.vue';
import usePictode from '@/hooks/usePictode';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const { app } = usePictode();

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

const formats = [
  { name: 'PNG', value: 'image/png' },
  { name: 'SVG', value: 'image/svg' },
  { name: 'JPG', value: 'image/jpg' },
];
const selectedFormat = ref(formats[0]);

const imgSrc = ref<string>('https://i.imgur.com/RWYeUDM.png');

const closeModal = () => {
  dialogVisible.value = false;
};

const updateImgSrc = async () => {
  console.log('=====>?', pixelRatio.value, selectedFormat.value);

  imgSrc.value = await app.toDataURL({
    pixelRatio: pixelRatio.value,
  });
};

onMounted(() => {
  updateImgSrc();
});
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <div class="flex items-center h-96 w-[50%]">
      <div
        class="w-full h-full flex flex-grow justify-center bg-fixed rounded-md p-1"
        style="
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);
        "
      >
        <img :src="imgSrc" />
      </div>
    </div>
    <div class="flex flex-col flex-wrap gap-6 grow ml-6 antialiased">
      <div class="text-lg">导出图片</div>
      <div class="flex flex-row justify-between items-center">
        <label>背景</label>
        <Switch v-model="enabled"></Switch>
      </div>
      <div class="flex flex-row justify-between items-center">
        <label>缩放比</label>
        <RadioGroup v-model="pixelRatio" class="rounded ring-1 ring-black ring-opacity-5 p-0.5" @change="updateImgSrc">
          <RadioGroupOption :value="1" class="font-mono text-xs">{{ '1x' }}</RadioGroupOption>
          <RadioGroupOption :value="2" class="font-mono text-xs">{{ '2x' }}</RadioGroupOption>
          <RadioGroupOption :value="3" class="font-mono text-xs">{{ '3x' }}</RadioGroupOption>
        </RadioGroup>
      </div>
      <div class="flex flex-row justify-between items-center">
        <label>图片格式</label>
        <Select v-model="selectedFormat" @change="updateImgSrc">
          <SelectOption
            v-for="(item, index) in formats"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></SelectOption>
        </Select>
      </div>
      <div class="grow flex flex-col justify-end">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-blue-400 text-blue-50"
        >
          下载
        </button>
      </div>
    </div>
  </Dialog>
</template>
