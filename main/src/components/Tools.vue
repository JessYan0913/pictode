<script setup lang="ts">
import usePictode from '@/hooks/usePictode';

import Radio from './Radio.vue';
import RadioGroup from './RadioGroup.vue';
import SvgIcon from './SvgIcon.vue';

const { currentTool, tools } = usePictode();
</script>

<template>
  <RadioGroup v-model="currentTool">
    <Radio v-for="(item, index) in tools" :key="index" :value="item.name">
      <SvgIcon :name="item.icon"></SvgIcon>
    </Radio>
  </RadioGroup>
</template>

<style scoped lang="scss">
.tools-horizontal {
  width: 100%;
  display: grid;
  grid-template-rows: auto;
  grid-auto-flow: column;
  gap: calc(0.25rem * 1);
  justify-items: center;

  & > .tool-icon {
    & > input {
      position: absolute;
      opacity: 0;
    }

    & > input:checked + div {
      background: #e3e2fe;
    }
  }
}

.tool-icon {
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
