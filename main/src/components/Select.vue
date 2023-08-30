<script setup lang="ts" generic="T extends Record<string | symbol | number, any>">
import { computed } from 'vue';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid';

const props = withDefaults(
  defineProps<{
    modelValue: T;
    options?: Array<T>;
    value?: string;
    label?: string;
  }>(),
  {
    options: () => [],
    value: () => 'value',
    label: () => 'label',
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', value: T): void;
  (event: 'change', value: T): void;
}>();

const selected = computed<T>({
  get(): T {
    return props.modelValue;
  },
  set(value: T) {
    if (value[props.value] === props.modelValue[props.value]) {
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
      <slot name="listbox" :selected="selected">
        <ListboxButton
          class="relative w-full cursor-pointer rounded ring-1 ring-black ring-opacity-5 p-0.5 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm"
        >
          <span class="block truncate">{{ selected[label] }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
      </slot>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="option in options"
            :key="option[value]"
            :value="option"
            as="template"
          >
            <slot :active="active" :selected="selected" :item="option">
              <li
                :class="[
                  active ? 'bg-blue-100' : 'text-gray-900',
                  'relative cursor-pointer select-none py-2 pl-10 pr-4',
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option[label] }}</span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </slot>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
