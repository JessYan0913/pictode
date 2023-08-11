<script setup lang="ts">
import { computed, toRefs } from 'vue';

import RadioGroup from '../../components/RadioGroup.vue';
import RadioGroupOption from '../../components/RadioGroupOption.vue';
import { FormValue, RadioGroupConfig } from '../types';

const props = defineProps<{
  config: RadioGroupConfig;
  formModel: FormValue;
  initValues?: FormValue;
  name: string;
  prop: string;
}>();

const emits = defineEmits<{
  (event: 'change', value: any): void;
}>();

const { formModel, name } = toRefs(props);
const selectedValue = computed({
  get() {
    return formModel.value[name.value];
  },
  set(value) {
    emits('change', value);
  },
});
</script>

<template>
  <RadioGroup v-model="selectedValue">
    <RadioGroupOption v-for="(option, index) in config.options" :key="index" :value="option.value">
      {{ option.text }}
    </RadioGroupOption>
  </RadioGroup>
</template>
../types
