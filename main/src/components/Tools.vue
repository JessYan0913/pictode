<script setup lang="ts">
import { selectTool } from '@pictode/core';

import { usePictode } from '@/hooks/usePictode';

import SvgIcon from './SvgIcon.vue';

const { app, tools, currentTool } = usePictode();

app.setTool(selectTool());
</script>

<template>
  <div class="tools-horizontal">
    <label v-for="(item, index) in tools" :key="index" class="tool-icon">
      <input :id="item.name" v-model="currentTool" type="radio" :value="item" />
      <div>
        <SvgIcon :name="item.icon"></SvgIcon>
      </div>
    </label>
  </div>
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
