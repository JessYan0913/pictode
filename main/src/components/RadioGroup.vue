<script setup lang="ts" generic="T">
import { computed } from 'vue';

export type RadioGroupOption<T> = {
  value: T;
  label: string;
};

const props = defineProps<{
  modelValue: T;
  options: RadioGroupOption<T>[];
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: T): void;
}>();

const selectedValue = computed<T>({
  get() {
    return props.modelValue;
  },
  set(value: T) {
    emits('update:modelValue', value);
  },
});
</script>

<template>
  <div class="radio-group">
    <label v-for="(item, index) in options" :key="index" class="radio">
      <input v-model="selectedValue" type="radio" :value="item.value" />
      <div>
        <slot :item="item"></slot>
      </div>
    </label>
  </div>
</template>

<style scoped lang="scss">
.radio-group {
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-auto-flow: column;
  gap: calc(0.25rem * 1);
  justify-items: center;

  & > .radio {
    & > input {
      position: absolute;
      opacity: 0;
    }

    & > input:checked + div {
      background: #e3e2fe;
    }
  }
}

.radio {
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

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
