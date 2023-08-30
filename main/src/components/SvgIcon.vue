<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

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

const { color } = toRefs(props);

const fill = ref<string>(color.value);

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
