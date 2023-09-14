<script setup lang="ts">
defineProps<{
  icon?: string;
  text?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    class="flex justify-center items-center cursor-pointer rounded-lg relative select-none border-0 bg-transparent disabled:bg-opacity-50 hover:bg-blue-100"
    v-bind="$attrs"
    :disabled="disabled"
  >
    <label class="flex items-center">
      <iconpark-icon v-if="icon" :name="icon" class="cursor-pointer"></iconpark-icon>
      {{ text }}
    </label>
  </button>
</template>
