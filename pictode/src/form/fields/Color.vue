<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

import ColorPicker from '@/components/ColorPicker.vue';

import { ColorPickerConfig, FormValue } from '../types';

const props = withDefaults(
  defineProps<{
    config: ColorPickerConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  },
);

const emits = defineEmits<(event: 'change', props: string, value: string) => void>();

const { model, prop } = toRefs(props);
const colors = ref<string>(prop?.value && model?.value?.[prop?.value]);

watch(
  () => colors.value,
  (v) => emits('change', prop.value, v),
);

watch(
  () => model.value,
  () => {
    colors.value = model?.value?.[prop?.value];
  },
);
</script>

<template>
  <div class="w-fit h-7">
    <ColorPicker v-model="colors" class="border rounded-lg" />
  </div>
</template>
