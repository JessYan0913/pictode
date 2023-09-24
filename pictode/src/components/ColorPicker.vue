<script setup lang="ts">
import { computed, ref } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

import 'vanilla-colorful/hex-alpha-color-picker.js';

const props = defineProps<{
  modelValue: string;
  popoverButtonColor?: string;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const popoverButtonRef = ref<HTMLDivElement>();

const color = computed<string>({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (value === props.modelValue) {
      return;
    }
    emits('update:modelValue', value);
  },
});

const popoverStyle = computed(() => {
  if (!popoverButtonRef.value) {
    return {};
  }

  const clientRect = popoverButtonRef.value.getBoundingClientRect();
  const popoverWidth = 200;
  const popoverHeight = 200;
  const rightOverflow = clientRect.x + popoverWidth - window.innerWidth;
  const bottomOverflow = clientRect.y + clientRect.height + popoverHeight - window.innerHeight;

  let left = 0;
  let top = clientRect.height;

  if (rightOverflow > 0) {
    left = clientRect.width - popoverWidth - 18;
  }

  if (bottomOverflow > 0) {
    top = -popoverHeight;
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});

const onColorChanged = (event: any) => {
  color.value = event.target?.color;
};
</script>

<template>
  <Popover class="relative" as="div">
    <PopoverButton as="div">
      <div
        ref="popoverButtonRef"
        :class="['w-8 h-8 rounded-lg cursor-pointer', props.popoverButtonColor]"
        :style="{ backgroundColor: color }"
      ></div>
    </PopoverButton>
    <PopoverPanel class="absolute z-10" :style="popoverStyle">
      <hex-alpha-color-picker
        :color="color"
        @mouseup="onColorChanged"
        @mouseout="onColorChanged"
      ></hex-alpha-color-picker>
    </PopoverPanel>
  </Popover>
</template>
