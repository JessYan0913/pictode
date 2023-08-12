<script setup lang="ts">
import { Form, FormConfig } from '@/form';

defineProps<{
  config: FormConfig;
}>();

const handleFormChange = (value: any) => {
  console.log('新的form', value);
};
</script>

<template>
  <Form :config="config" label-position="top" @change="handleFormChange"></Form>
</template>
