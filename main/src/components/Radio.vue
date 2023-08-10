<script setup lang="ts">
import { RadioGroupOption } from '@headlessui/vue';

defineProps<{
  value: string | number | boolean | Record<string, any> | undefined;
}>();
</script>

<template>
  <RadioGroupOption v-slot="{ checked }" :value="value">
    <div :class="['pictode-radio-group-option', checked ? 'checked' : '']">
      <slot></slot>
    </div>
  </RadioGroupOption>
</template>
