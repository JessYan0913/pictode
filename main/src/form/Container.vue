<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { injectStrict } from '@pictode/vue-aide';
import { ElFormItem } from 'element-plus';

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

const emits = defineEmits<{
  (event: 'change', model: FormValue): void;
}>();

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
  <div>
    <ElFormItem
      :class="{ hidden: `${labelWidth}` === '0' || !config.label, 'select-none': true }"
      :prop="itemProp"
      :label-width="labelWidth"
      :label="config.label"
    >
      <component
        :key="config.name"
        :is="type"
        :class="config.class"
        :model="model"
        :config="config"
        :prop="itemProp"
        @change="handleChange"
      ></component>
    </ElFormItem>
  </div>
</template>
