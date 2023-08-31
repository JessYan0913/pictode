<script setup lang="ts">
import SvgIcon from './SvgIcon.vue';

defineProps<{
  icon?: string;
  text?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    class="flex justify-center items-center rounded-lg relative select-none border-0 bg-transparent disabled:bg-opacity-50 hover:bg-blue-100"
    v-bind="$attrs"
    :disabled="disabled"
  >
    <label>
      <SvgIcon v-if="icon" :name="icon" class="cursor-pointer"></SvgIcon>
      {{ text }}
    </label>
  </button>
</template>
