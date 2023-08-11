<script setup lang="ts">
import { provide, reactive, ref, toRaw, toRefs } from 'vue';
import { ElForm, FormInstance } from 'element-plus';

import { FormStateKey } from '../constants/inject-key';

import Container from './Container.vue';
import { FormConfig, FormItemLabelPosition, FormSize, FormState, FormValue } from './types';

const props = withDefaults(
  defineProps<{
    config?: FormConfig;
    initValues?: FormValue;
    parentValues?: FormValue;
    labelWidth?: string;
    disabled?: boolean;
    height?: string;
    size?: FormSize;
    inline?: boolean;
    labelPosition?: FormItemLabelPosition;
    keyProp?: string;
  }>(),
  {
    config: () => [],
    initValues: () => ({}),
    parentValues: () => ({}),
    labelWidth: '200px',
    disabled: false,
    height: 'auto',
    size: 'default',
    inline: false,
    labelPosition: 'right',
    keyProp: '__key',
  }
);

const emits = defineEmits<{
  (event: 'change', value: FormValue): void;
}>();

const fields = new Map<string, any>();

const { keyProp, config, initValues, parentValues } = toRefs(props);
const formRef = ref<FormInstance>();
const formModel = ref<FormValue>(initValues);
const formState = reactive<FormState>({
  keyProp: keyProp.value,
  config: config.value,
  initValues: initValues.value,
  parentValues: parentValues.value,
  formModel: formModel.value,
  $emit: emits,
  setField(prop, field) {
    fields.set(prop, field);
  },
  getField(prop) {
    return fields.get(prop);
  },
  deleteField(prop) {
    return fields.delete(prop);
  },
});

const handleChange = () => emits('change', formModel.value);
const handleSubmit = async (): Promise<FormValue> => {
  try {
    await formRef.value?.validate();
    return toRaw(formModel.value);
  } catch (invalidFields: any) {
    const error: string[] = [];
    Object;
    throw new Error(error.join('<br>'));
  }
};
const handleReset = () => formRef.value?.resetFields();

provide(FormStateKey, formState);

defineExpose({
  values: formModel,
  formState,
  handleChange,
  resetForm: handleReset,
  submitForm: handleSubmit,
});
</script>

<template>
  <ElForm ref="formRef" :model="formModel" :label-position="labelPosition" :size="size">
    <Container
      v-for="(childConfig, index) in props.config"
      :key="index"
      :config="childConfig"
      :form-model="formModel"
    ></Container>
  </ElForm>
</template>
./types
