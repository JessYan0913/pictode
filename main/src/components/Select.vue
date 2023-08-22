<script setup lang="ts" generic="T  extends string | number | boolean | object | null | undefined">
import { computed } from 'vue';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  modelValue: T;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: T): void;
  (event: 'change', value: T): void;
}>();

const selected = computed<T>({
  get() {
    return props.modelValue;
  },
  set(value: T) {
    if (compareDepartments(value, props.modelValue)) {
      return;
    }
    emits('update:modelValue', value);
    emits('change', value);
  },
});

const compareDepartments = (a: any, b: any): boolean => {
  return a.value === b.value || a.value === selected.value;
};
</script>

<template>
  <Listbox v-model="selected" class="w-24" :by="compareDepartments">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-default rounded ring-1 ring-black ring-opacity-5 p-0.5 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm"
        v-slot="{ value }"
      >
        <span class="block truncate">{{ value.label }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <slot></slot>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
