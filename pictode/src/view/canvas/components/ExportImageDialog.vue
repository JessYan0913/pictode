<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { injectStrict } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import Select from '@/components/Select.vue';
import Switch from '@/components/Switch.vue';
import { PictodeAppKey, PictodeSelectedKey } from '@/constants/inject-key';
import { MimeType } from '@/constants/mime-type';
import useExport from '@/hooks/useExport';

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const app = injectStrict(PictodeAppKey);
const selected = injectStrict(PictodeSelectedKey);

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

const formats = [
  { label: 'PNG', value: MimeType.PNG, format: 'png' },
  { label: 'JPEG', value: MimeType.JPEG, format: 'jpeg' },
];

const haveBackground = ref<boolean>(true);
const pixelRatio = ref<number>(2);
const selectedFormat = ref(formats[0]);

const imgSrc = ref<string>('');

const closeModal = () => {
  dialogVisible.value = false;
};

const updateImgSrc = async () => {
  const { dataURL } = await app.toDataURL(selected.value, {
    pixelRatio: pixelRatio.value,
    mimeType: selectedFormat.value.value,
    haveBackground: haveBackground.value,
  });
  imgSrc.value = dataURL;
};

const onDownload = async () => {
  const { execute } = useExport(
    () => {
      return imgSrc.value;
    },
    () => `Pictode-${new Date()}.${selectedFormat.value.format}`,
    selectedFormat.value.value,
    'utf-8',
    true
  );
  await execute();
  dialogVisible.value = false;
};

onMounted(() => {
  nextTick(() => {
    updateImgSrc();
  });
});
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <template #title>
      <div class="text-lg">导出图片</div>
    </template>
    <div class="max-w-5xl min-w-fit flex flex-row justify-between transform overflow-hidden">
      <div class="flex items-center h-96 w-96">
        <div
          class="w-full h-full flex flex-grow justify-center bg-fixed rounded-md p-1"
          style="
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==);
          "
        >
          <img :src="imgSrc" class="object-contain max-w-full max-h-full" />
        </div>
      </div>
      <div class="flex flex-col flex-wrap w-96 min-w-max gap-6 grow ml-6 antialiased p-2">
        <div class="flex flex-row justify-between items-center">
          <label>背景</label>
          <Switch v-model="haveBackground" @change="updateImgSrc"></Switch>
        </div>
        <div class="flex flex-row justify-between items-center">
          <label>缩放比</label>
          <RadioGroup
            v-model="pixelRatio"
            class="rounded ring-1 ring-black ring-opacity-5 p-0.5"
            @change="updateImgSrc"
          >
            <RadioGroupOption :value="1" class="font-mono text-xs">{{ '1x' }}</RadioGroupOption>
            <RadioGroupOption :value="2" class="font-mono text-xs">{{ '2x' }}</RadioGroupOption>
            <RadioGroupOption :value="3" class="font-mono text-xs">{{ '3x' }}</RadioGroupOption>
          </RadioGroup>
        </div>
        <div class="flex flex-row justify-between items-center">
          <label>图片格式</label>
          <Select v-model="selectedFormat" :options="formats" class="w-24" @change="updateImgSrc"> </Select>
        </div>
        <div class="grow flex flex-col justify-end">
          <Button
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-blue-400 text-blue-50"
            title="下载"
            text="下载"
            @click="onDownload"
          >
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
