<script setup lang="ts">
import { ListboxOption } from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/solid';

defineProps<{
  value: string | number | boolean | object | null | undefined;
  label: string | number;
}>();
</script>

<template>
  <ListboxOption v-slot="{ active, selected }" :value="{ value, label }" as="template">
    <li :class="[active ? 'bg-blue-100' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ label }}</span>
      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
        <CheckIcon class="h-5 w-5" aria-hidden="true" />
      </span>
    </li>
  </ListboxOption>
</template>
