<script setup lang="ts">
import { RadioGroupOption } from '@headlessui/vue';

defineProps<{
  value: string | number | boolean | Record<string, any> | undefined;
}>();
</script>

<template>
  <RadioGroupOption v-slot="{ checked }" :value="value">
    <div
      :class="[
        'rounded-lg inline-flex items-center relative cursor-pointer select-none p-2',
        checked ? 'bg-violet-200' : '',
      ]"
    >
      <slot></slot>
    </div>
  </RadioGroupOption>
</template>
