<script setup lang="ts">
import { computed, ref } from 'vue';
const props = withDefaults(
  defineProps<{
    name: string;
    prefix?: string;
    size?: number | string;
    color?: string;
    activeColor?: string;
  }>(),
  {
    prefix: 'icon',
    size: '1rem',
    color: 'currentColor',
    activeColor: 'currentColor',
  }
);

const fill = ref<string>(props.color);

const svgSymbol = computed<string>(() => `#${props.prefix}-${props.name}`);
</script>

<template>
  <i class="icon" @mouseover="fill = activeColor" @mouseout="fill = color">
    <svg viewBox="0 0 1024 1024" aria-hidden="true" :width="size" :height="size">
      <use :fill="fill" :xlink:href="svgSymbol" />
    </svg>
  </i>
</template>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
  font-size: v-bind(size);
}
</style>
