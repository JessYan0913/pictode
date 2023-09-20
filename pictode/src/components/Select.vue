<script setup lang="ts" generic="T extends string | number | boolean | Record<string, any> | undefined">
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
  get(): T {
    return props.modelValue;
  },
  set(value: T) {
    if (value === props.modelValue) {
      return;
    }
    emits('update:modelValue', value);
    emits('change', value);
  },
});
</script>

<template>
  <Listbox v-model="selected">
    <div class="relative mt-1">
      <ListboxButton class="relative w-full">
        <slot name="listbox" :selected="selected">
          <div
            class="relative w-full cursor-pointer rounded ring-1 ring-black ring-opacity-5 p-0.5 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm"
          >
            <span class="block truncate">{{ selected }}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </div>
        </slot>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions>
          <slot></slot>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
