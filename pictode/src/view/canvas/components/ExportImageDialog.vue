<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/24/solid';
import { injectStrict } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import Select from '@/components/Select.vue';
import SelectOption from '@/components/SelectOption.vue';
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

const formatOptions = [
  { label: 'PNG', value: MimeType.PNG, format: 'png' },
  { label: 'JPEG', value: MimeType.JPEG, format: 'jpeg' },
];
const pixelRatioOptions = [1, 2, 3];

const haveBackground = ref<boolean>(true);
const pixelRatio = ref<number>(2);
const selectedFormatValue = ref(formatOptions[0].value);

const imgSrc = ref<string>('');

const closeModal = () => {
  dialogVisible.value = false;
};

const updateImgSrc = async () => {
  const { dataURL } = await app.toDataURL(selected.value, {
    pixelRatio: pixelRatio.value,
    mimeType: selectedFormatValue.value,
    haveBackground: haveBackground.value,
  });
  imgSrc.value = dataURL;
};

const onDownload = async () => {
  const { execute } = useExport(
    () => {
      return imgSrc.value;
    },
    () => `Pictode-${new Date()}.${formatOptions.find((item) => item.value === selectedFormatValue.value)?.format}`,
    selectedFormatValue.value,
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
      <div class="text-lg">{{ $t('导出图片') }}</div>
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
          <label>{{ $t('背景') }}</label>
          <Switch v-model="haveBackground" @change="updateImgSrc"></Switch>
        </div>
        <div class="flex flex-row justify-between items-center">
          <label>{{ $t('缩放比') }}</label>
          <RadioGroup
            v-model="pixelRatio"
            class="rounded-lg ring-1 w-24 ring-slate-950 dark:ring-navyBlue-100 p-0.5"
            @change="updateImgSrc"
          >
            <div class="flex flex-grow justify-around flex-wrap">
              <RadioGroupOption
                v-for="(pixel, index) in pixelRatioOptions"
                :key="index"
                :value="pixel"
                class="font-mono text-xs"
              >
                <template #default="{ checked }">
                  <div
                    :class="[
                      'rounded-lg inline-flex items-center relative cursor-pointer select-none p-2',
                      checked ? 'bg-blue-500' : 'hover:bg-gray-200 dark:hover:bg-navyBlue-100',
                    ]"
                  >
                    {{ `${pixel}x` }}
                  </div>
                </template>
              </RadioGroupOption>
            </div>
          </RadioGroup>
        </div>
        <div class="flex flex-row justify-between items-center">
          <label>{{ $t('图片格式') }}</label>
          <Select v-model="selectedFormatValue" class="w-24" @change="updateImgSrc">
            <template #listbox>
              <div
                class="relative w-full cursor-pointer rounded-lg ring-1 ring-slate-950 dark:ring-navyBlue-100 py-2 pl-2 pr-6 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm"
              >
                <span class="block truncate">{{
                  formatOptions.find((item) => item.value === selectedFormatValue)?.label
                }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
                </span>
              </div>
            </template>
            <div
              class="absolute mt-3 max-h-60 w-fit rounded-lg bg-white dark:bg-navyBlue-200 py-1 text-base shadow-lg ring-1 ring-slate-950 dark:ring-navyBlue-100 focus:outline-none sm:text-sm"
            >
              <SelectOption
                v-for="({ label, value }, index) in formatOptions"
                :key="index"
                :value="value"
                :label="label"
                class="p-1 w-24"
              ></SelectOption>
            </div>
          </Select>
        </div>
        <div class="grow flex flex-col justify-end">
          <Button
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-blue-400 text-blue-50"
            :title="$t('下载')"
            :text="$t('下载')"
            @click="onDownload"
          >
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
