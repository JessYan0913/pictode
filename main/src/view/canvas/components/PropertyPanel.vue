<script setup lang="ts">
import { Form } from '@/form';
import usePictode from '@/hooks/usePictode';

const { app, selected, panelFormConfig, panelFormModel } = usePictode();

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
  <div v-if="panelFormConfig.length">
    <Form :model="panelFormModel" :config="panelFormConfig" @change="handleFormChange"></Form>
  </div>
</template>
