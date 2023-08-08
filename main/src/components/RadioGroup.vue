<script setup lang="ts" generic="T">
import { computed, provide } from 'vue';

import { RadioCtxKey } from '@/constants/injection-keys';

export type RadioGroupOption<T> = {
  value: T;
  label: string;
};

const props = defineProps<{
  modelValue: T;
}>();

const emits = defineEmits<{
  (event: 'change', value: T): void;
  (event: 'update:modelValue', value: T): void;
}>();

const selectedValue = computed<T>({
  get() {
    return props.modelValue;
  },
  set(value: T) {
    emits('change', value);
    emits('update:modelValue', value);
  },
});

provide(RadioCtxKey, {
  modelValue: selectedValue,
});
</script>

<template>
  <div class="radio-group">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.radio-group {
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-auto-flow: column;
  gap: calc(0.25rem * 1);
  justify-items: center;
}
</style>
