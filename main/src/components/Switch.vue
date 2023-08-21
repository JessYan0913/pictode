<script setup lang="ts">
import { computed } from 'vue';
import { Switch } from '@headlessui/vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (event: 'change', value: boolean): void;
  (event: 'update:modelValue', value: boolean): void;
}>();

const enabled = computed<boolean>({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    if (value === props.modelValue) {
      return;
    }
    emits('update:modelValue', value);
    emits('change', value);
  },
});
</script>

<template>
  <Switch
    v-model="enabled"
    :class="enabled ? 'bg-blue-400' : 'bg-gray-200'"
    class="relative inline-flex h-6 w-11 items-center rounded-full"
  >
    <span class="sr-only">Enable notifications</span>
    <span
      :class="enabled ? 'translate-x-6' : 'translate-x-1'"
      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
    />
  </Switch>
</template>
