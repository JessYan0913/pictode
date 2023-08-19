<script setup lang="ts">
import { Form } from '@/form';
import usePictode from '@/hooks/usePictode';

const { app, selected, panelConfig } = usePictode();

const handleFormChange = (value: any) => {
  app.update(
    ...selected.value.map((node) => {
      const newNode = node.toObject();
      newNode.attrs = {
        ...newNode.attrs,
        ...value,
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
    :model="panelConfig.model"
    label-position="top"
    @change="handleFormChange"
  ></Form>
</template>
