<script setup lang="ts" generic="T">
import { RadioCtxKey } from '@/constants/injection-keys';
import { injectStrict } from '@/utils/vue';

defineProps<{
  value: T;
}>();

const { modelValue } = injectStrict(RadioCtxKey);
</script>

<template>
  <label class="radio">
    <input v-model="modelValue" type="radio" :value="value" />
    <div>
      <slot></slot>
    </div>
  </label>
</template>

<style scoped lang="scss">
.radio {
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  & > input {
    position: absolute;
    opacity: 0;
  }

  & > input:checked + div {
    background: #e3e2fe;
  }

  div {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
  }
}
</style>
