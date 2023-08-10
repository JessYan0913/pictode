<script setup lang="ts" generic="T extends string | number | boolean | Record<string, any> | undefined">
import { computed } from 'vue';
import { RadioGroup } from '@headlessui/vue';

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
</script>

<template>
  <RadioGroup v-model="selectedValue">
    <div class="flex flex-grow justify-around flex-wrap">
      <slot></slot>
    </div>
  </RadioGroup>
</template>
