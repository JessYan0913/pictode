<script setup lang="ts">
import { Form } from '@/form';
import usePictode from '@/hooks/usePictode';

const { formConfig } = usePictode();

const handleFormChange = (value: any) => {
  console.log('新的form', value);
};
</script>

<template>
  <Form v-if="formConfig.length" :config="formConfig" label-position="top" @change="handleFormChange"></Form>
</template>
