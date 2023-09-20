<script setup lang="ts">
import { RadioGroupOption } from '@headlessui/vue';

defineProps<{
  value: string | number | boolean | Record<string, any> | undefined;
}>();
</script>

<template>
  <RadioGroupOption v-slot="{ checked }" :value="value">
    <div>
      <slot :checked="checked"></slot>
    </div>
  </RadioGroupOption>
</template>
