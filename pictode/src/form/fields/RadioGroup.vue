<script setup lang="ts" generic="T extends string | number | boolean | Record<string|number, any> | undefined">
import { ref, toRefs, watch } from 'vue';

import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';

import { FormValue, RadioGroupConfig } from '../types';

const props = withDefaults(
  defineProps<{
    config: RadioGroupConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  }
);

const emits = defineEmits<{
  (event: 'change', prop: string, value: T): void;
}>();

const { model, prop } = toRefs(props);
const value = ref<T>(prop?.value && model?.value?.[prop?.value]);

watch(
  () => value.value,
  (v) => emits('change', prop.value, v as T)
);

watch(
  () => model.value,
  () => {
    value.value = model?.value?.[prop?.value];
  }
);
</script>

<template>
  <RadioGroup v-model="value">
    <div class="w-full flex justify-start gap-2">
      <RadioGroupOption
        v-for="(option, index) in config.options"
        :key="index"
        :value="option.value"
        :title="option.title"
        class="border rounded-lg inline-flex items-center relative cursor-pointer select-none"
      >
        <iconpark-icon
          v-if="config.optionType === 'icon'"
          :name="option.label"
          :stroke="value === option.value ? 'rgb(143, 191, 255)' : '#333'"
          :fill="value === option.value ? 'rgb(143, 191, 255)' : 'none'"
        ></iconpark-icon>
        <div v-else :class="option.class">{{ option.label }}</div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
