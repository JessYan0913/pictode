<script setup lang="ts">
import SvgIcon from './SvgIcon.vue';

defineProps<{
  icon?: string;
  text?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button class="pictode-button" v-bind="$attrs" :disabled="disabled">
    <label>
      <SvgIcon v-if="icon" :name="icon"></SvgIcon>
      {{ text }}
    </label>
  </button>
</template>

<style scoped lang="scss">
.pictode-button {
  display: flex;
  justify-content: center;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  user-select: none;
  border: 0;
  background: transparent;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    background: #c0c0c07a;
  }

  &:not([disabled]) * {
    cursor: pointer;
  }

  &:not([disabled]):hover {
    background: #e3e2fe;
  }
}
</style>
