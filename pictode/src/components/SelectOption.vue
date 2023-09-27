<script setup lang="ts">
import { ListboxOption } from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/solid';

defineProps<{
  value: string | number | boolean;
  label: string | number | boolean;
}>();
</script>

<template>
  <ListboxOption v-slot="{ active, selected }" :value="value">
    <slot :active="active" :selected="selected" :item="value">
      <li
        :class="[
          active ? 'bg-gray-200 dark:bg-navyBlue-100' : '',
          'relative rounded-lg cursor-pointer select-none p-2 pl-10 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navyBlue-100',
        ]"
      >
        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ label }}</span>
        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
          <CheckIcon class="h-5 w-5" aria-hidden="true" />
        </span>
      </li>
    </slot>
  </ListboxOption>
</template>
