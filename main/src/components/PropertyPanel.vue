<script setup lang="ts">
import { Form } from '@/form';
import usePictode from '@/hooks/usePictode';

const { app, selected, panelConfig, panelValue } = usePictode();

const handleFormChange = (value: any) => {
  app.update(
    ...selected.value.map((node) => {
      const newNode = node.toObject();
      newNode.attrs = {
        ...newNode.attrs,
        ...panelConfig.value?.model.reduce((model, key) => ({ ...model, [key]: value[key] }), {}),
      };
      return newNode;
    })
  );
};
</script>

<template>
  <Form
    v-if="panelConfig?.formConfig.length"
    :config="panelConfig.formConfig"
    :model="panelValue"
    label-position="top"
    @change="handleFormChange"
  ></Form>
</template>
