<script setup lang="ts">
import { Form } from '@/form';
import usePictode from '@/hooks/usePictode';

const { app, selected, panelConfig, panelValue } = usePictode();

const handleFormChange = (value: any) => {
  app.update(
    ...selected.value.map((node) => {
      const newNode = node.toObject();
      console.log('======?', newNode);

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
    v-if="panelConfig.length"
    :config="panelConfig"
    :model="panelValue"
    label-position="top"
    @change="handleFormChange"
  ></Form>
</template>
