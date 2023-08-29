<script setup lang="ts">
import { injectStrict } from '@pictode/vue-aide';

import { PictodeAppKey, PictodePanelFormKey, PictodeSelectedKey } from '@/constants/inject-key';
import { Form } from '@/form';

const app = injectStrict(PictodeAppKey);
const selected = injectStrict(PictodeSelectedKey);
const { panelFormConfig, panelFormModel } = injectStrict(PictodePanelFormKey);

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
