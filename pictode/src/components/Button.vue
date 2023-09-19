<script setup lang="ts">
defineProps<{
  icon?: string;
  text?: string;
}>();
</script>

<template>
  <button type="button" v-bind="$attrs">
    <slot>
      <label class="flex justify-center items-center">
        <iconpark-icon v-if="icon" :name="icon" :title="$attrs['title']" class="cursor-pointer"></iconpark-icon>
        <span class="cursor-pointer">{{ text }}</span>
      </label>
    </slot>
  </button>
</template>
