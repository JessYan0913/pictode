<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { injectStrict } from '@pictode/vue-aide';

import { FormStateKey } from '../constants/inject-key';

import { ChildConfig, FormSize, FormValue } from './types';

const props = withDefaults(
  defineProps<{
    config: ChildConfig;
    model: FormValue;
    prop?: string;
    labelWidth?: string;
    size?: FormSize;
  }>(),
  {
    prop: '',
    size: 'small',
  }
);

const emits = defineEmits<(event: 'change', model: FormValue) => void>();

const formState = injectStrict(FormStateKey);

const { config, prop, model } = toRefs(props);

const name = computed<string | number>(() => config.value.name || '');

const itemProp = computed<string>(() => {
  let result: string | number = '';
  if (name.value) {
    result = name.value;
  } else {
    return prop.value;
  }
  return `${prop.value}${prop.value ? '.' : ''}${result}`;
});

const type = computed<string>(() => {
  let { type } = config.value;
  if (type === 'form') {
    return '';
  }
  return type?.replace(/([A-Z])/g, '-$1').toLowerCase();
});

const handleChange = async (prop: string, v: any) => {
  let value = v;
  try {
    if (typeof config.value.onChange === 'function') {
      value = await config.value.onChange(formState, value, {
        model: model.value,
        config: config.value,
        prop,
      });
    }
  } catch (error) {
    console.error(error);
  }
  if (Reflect.get(model.value, prop) === value) {
    return;
  }
  Reflect.set(model.value, prop, value);
  emits('change', model.value);
};
</script>

<template>
  <div
    :class="[
      `${labelWidth}` === '0' || !config.label ? 'hidden' : '',
      'select-none',
      'flex flex-col content-start gap-1 px-1 py-2',
    ]"
  >
    <label :style="{ width: `${labelWidth}px` }" class="text-start text-sm text-gray-600 dark:text-gray-300">{{
      $t(config.label ?? '')
    }}</label>
    <component
      :key="config.name"
      :is="type"
      :class="config.class"
      :model="model"
      :config="config"
      :prop="itemProp"
      @change="handleChange"
    ></component>
  </div>
</template>
