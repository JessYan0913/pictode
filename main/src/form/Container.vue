<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { injectStrict } from '@pictode/vue-aide';
import { ElFormItem } from 'element-plus';

import { FormStateKey } from '../constants/inject-key';

import { ChildConfig, FormSize, FormValue, OnChangeHandler } from './types';

const props = withDefaults(
  defineProps<{
    config: ChildConfig;
    formModel: FormValue;
    prop?: string;
    labelWidth?: string;
    size?: FormSize;
  }>(),
  {
    prop: '',
    size: 'small',
  }
);

const formState = injectStrict(FormStateKey);

const { config, prop, formModel } = toRefs(props);

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
  if (typeof type === 'function') {
    type = type(formState, { model: formModel });
  }
  if (type === 'form') {
    return '';
  }
  return type?.replace(/([A-Z])/g, '-$1').toLowerCase();
});

const handleChange = (onChange?: OnChangeHandler, value?: FormValue | number | string): any => {
  if (typeof onChange !== 'function') {
    return;
  }
  return onChange(formState, value, {
    initValue: formState.initValues,
    model: formModel,
    parent: formState.parentValues,
    formValue: formModel.value,
    prop: itemProp.value,
    config: config.value,
  });
};

const onChangeHandler = async (v: FormValue) => {
  console.log('======');

  const { onChange, name } = config.value;
  let value: FormValue | number | string = v;

  try {
    value = (await handleChange(onChange, value)) ?? value;
  } catch (error) {
    console.error(error);
  }

  if (
    (name || (typeof name === 'number' && name === 0)) &&
    formModel.value !== value &&
    (v !== value || formModel.value[name] !== value)
  ) {
    formModel.value[name] = value;
  }
};
</script>

<template>
  <div>
    <ElFormItem
      :class="{ hidden: `${labelWidth}` === '0' || !config.label }"
      :prop="itemProp"
      :label-width="labelWidth"
      :label="config.label"
    >
      <component
        :key="config.name"
        :is="type"
        :form-model="formModel"
        :config="config"
        :name="name"
        :prop="itemProp"
        @change="onChangeHandler"
      ></component>
    </ElFormItem>
  </div>
</template>
./types
