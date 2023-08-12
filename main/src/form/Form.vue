<script setup lang="ts">
import { provide, reactive, ref, toRaw, toRefs } from 'vue';
import { ElForm, FormInstance } from 'element-plus';

import { FormStateKey } from '../constants/inject-key';

import Container from './Container.vue';
import { FormConfig, FormItemLabelPosition, FormSize, FormState, FormValue } from './types';

const props = withDefaults(
  defineProps<{
    model?: FormValue;
    config?: FormConfig;
    labelWidth?: string;
    disabled?: boolean;
    height?: string;
    size?: FormSize;
    inline?: boolean;
    labelPosition?: FormItemLabelPosition;
  }>(),
  {
    config: () => [],
    model: () => ({}),
    labelWidth: '200px',
    disabled: false,
    height: 'auto',
    size: 'default',
    inline: false,
    labelPosition: 'right',
  }
);

const emits = defineEmits<{
  (event: 'change', value: FormValue): void;
  (event: 'update:modelValue', value: FormValue): void;
}>();

const { config, model } = toRefs(props);

const formRef = ref<FormInstance>();

const formModel = ref<FormValue>(model);

const formState = reactive<FormState>({
  config: config.value,
  model: formModel.value,
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
  formModel,
  formState,
  resetForm: handleReset,
  submitForm: handleSubmit,
});
</script>

<template>
  <ElForm ref="formRef" :model="formModel" :label-position="labelPosition" :size="size" @change="handleChange">
    <Container
      v-for="(childConfig, index) in props.config"
      :key="index"
      :config="childConfig"
      :model="formModel"
      @change="handleChange"
    ></Container>
  </ElForm>
</template>
