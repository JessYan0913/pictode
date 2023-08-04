<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { selectTool } from '@pictode/core';

import Tools from '@/components/Tools.vue';
import { usePictode } from '@/hooks/usePictode';

const { app } = usePictode();
app.setTool(selectTool());

const canvasRef = ref<HTMLDivElement>();
const propertyVisible = ref<boolean>(false);

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});
</script>

<template>
  <div class="container">
    <div class="side-top">
      <div class="menu">
        <div class="top-left">
          <div class="dropdown-menu-button" @click="propertyVisible = !propertyVisible">🎨</div>
          <div v-if="propertyVisible" class="island">属性面板</div>
        </div>
        <section class="shapes-section">
          <Tools></Tools>
        </section>
        <div>
          <div class="undo-redo-buttons">
            <label class="button">
              <div @click="app.undo()">↩️</div>
            </label>
            <label class="button">
              <div @click="app.redo()">↪️</div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div ref="canvasRef" class="canvas"></div>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  height: 100vh;
}

.side-top {
  position: absolute;
  left: 1rem;
  top: 1rem;
  right: 1rem;
  padding: 10px;
  z-index: 1;
}

.menu {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3rem;
  align-items: flex-start;
  cursor: default;
  pointer-events: none !important;
  font-family: 'AlimamaFangYuanTi';

  & > *:first-child {
    justify-self: flex-start;
  }

  & > *:last-child {
    justify-self: flex-end;
  }
}

.top-left {
  display: grid;
  gap: cal(0.25rem * 6);
  grid-template-columns: auto;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  pointer-events: all;
}

.dropdown-menu-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.625rem;
  cursor: pointer;
  font-size: 36px;
  width: 36px;
  height: 36px;
}

.island {
  background-color: rgba(256, 256, 256, 0.96);
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.05), 0px 0px 3.12708px rgba(0, 0, 0, 0.0798),
    0px 0px 0.931014px rgba(0, 0, 0, 0.1702);
  border-radius: 0.5rem;
  transition: box-shadow 0.5s ease-in-out;
  overflow-y: auto;
  padding: 0.75rem;
  width: 202px;
  box-sizing: border-box;
  max-height: 667px;
}

.shapes-section {
  display: flex;
  justify-content: center;
  pointer-events: none !important;

  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.88);
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.05), 0px 0px 3.12708px rgba(0, 0, 0, 0.0798),
    0px 0px 0.931014px rgba(0, 0, 0, 0.1702);
  border-radius: 0.5rem;
  padding: calc(1 * 0.25rem);
  position: relative;
  transition: box-shadow 0.5s ease-in-out;

  & > * {
    pointer-events: all;
  }
}

.canvas {
  width: 100%;
  height: 100%;
}

.undo-redo-buttons {
  pointer-events: all;
  display: grid;
  grid-auto-flow: column;
  margin-top: auto;
  margin-bottom: auto;
  margin-inline-start: 0.6em;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.88);
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.05), 0px 0px 3.12708px rgba(0, 0, 0, 0.0798),
    0px 0px 0.931014px rgba(0, 0, 0, 0.1702);
  border-radius: 0.5rem;
  padding: calc(1 * 0.25rem);
  position: relative;
  transition: box-shadow 0.5s ease-in-out;

  & > label {
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
}
</style>
