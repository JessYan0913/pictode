<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';

import { FormValue, TextsConfig } from '../types';

const props = withDefaults(
  defineProps<{
    config: TextsConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  }
);

const emits = defineEmits<(event: 'change', props: string, value: string) => void>();

const { model, prop } = toRefs(props);
const value = ref<string>(prop?.value && model?.value?.[prop?.value]);

watch(
  () => value.value,
  (v) => emits('change', prop.value, v)
);

watch(
  () => model.value,
  () => {
    value.value = model?.value?.[prop?.value];
  }
);
</script>

<template>
  <div class="w-fit h-7">
    <input v-model="value" class="border rounded-lg" />
  </div>
</template>
