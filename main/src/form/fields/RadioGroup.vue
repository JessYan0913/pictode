<script setup lang="ts" generic="T extends string | number | boolean | Record<string|number, any> | undefined">
import { ref, toRefs, watch } from 'vue';

import RadioGroup from '@/components/RadioGroup.vue';
import RadioGroupOption from '@/components/RadioGroupOption.vue';
import SvgIcon from '@/components/SvgIcon.vue';

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
  (event: 'update:modelValue', value: T): void;
}>();

const { model, prop } = toRefs(props);
const value = ref<T>(prop?.value && model?.value?.[prop?.value]);

watch(
  () => value.value,
  (v) => {
    emits('update:modelValue', v as T);
    emits('change', prop.value, v as T);
  }
);
</script>

<template>
  <RadioGroup v-model="value">
    <div class="w-full flex justify-start">
      <RadioGroupOption v-for="(option, index) in config.options" :key="index" :value="option.value" class="p-1">
        <SvgIcon v-if="config.optionType === 'icon'" :name="option.label"></SvgIcon>
        <span v-else>{{ option.label }}</span>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
