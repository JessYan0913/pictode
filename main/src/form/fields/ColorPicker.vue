<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { ElColorPicker } from 'element-plus';

import { ColorPickerConfig, FormValue } from '../types';

const props = withDefaults(
  defineProps<{
    config: ColorPickerConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  }
);

const emits = defineEmits<{
  (event: 'change', props: string, value: string): void;
}>();

const { model, prop } = toRefs(props);
const colors = ref<string>(prop?.value && model?.value?.[prop?.value]);

watch(
  () => colors.value,
  (v) => emits('change', prop.value, v)
);
</script>

<template>
  <div class="w-7 h-7">
    <ElColorPicker
      v-model="colors"
      show-alpha
      color-format="hex"
      class="inline-block w-full h-full cursor-pointer"
      type="color"
    />
  </div>
</template>
