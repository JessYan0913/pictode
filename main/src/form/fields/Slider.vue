<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';

import { FormValue, SliderConfig } from '../types';

const props = withDefaults(
  defineProps<{
    config: SliderConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  }
);

const emits = defineEmits<{
  (event: 'change', prop: string, value: number): void;
}>();

const { model, prop, config } = toRefs(props);
const value = ref<number>(prop?.value && model?.value?.[prop?.value]);
const min = computed<number>(() => config.value.min || 0);
const max = computed<number>(() => config.value.max || 1);
const step = computed<number>(() => config.value.step || 0.01);

watch(
  () => value.value,
  (v) => emits('change', prop.value, +v)
);

watch(
  () => model.value,
  () => {
    value.value = model?.value?.[prop?.value];
  }
);
</script>

<template>
  <div class="w-full h-full">
    <input v-model="value" type="range" class="block w-full h-full cursor-pointer" :min="min" :max="max" :step="step" />
  </div>
</template>
