<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue';
import {
  App,
  drawingTool,
  ellipseTool,
  imageTool,
  lineTool,
  rectTool,
  regularPolygonTool,
  selectTool,
  textTool,
  Tool,
} from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

const app = new App();
app.use(new HistoryPlugin());
app.setTool(selectTool());

const canvasRef = ref<HTMLDivElement>();

const tools = reactive<Array<{ icon: string; title: string; tool: () => Tool }>>([
  {
    icon: '🖱️',
    title: 'selection',
    tool: selectTool,
  },
  {
    icon: '🟦',
    title: 'rectangle',
    tool: rectTool,
  },
  {
    icon: '🔵',
    title: 'ellipse',
    tool: ellipseTool,
  },
  {
    icon: '🔷',
    title: 'regularPolygon',
    tool: regularPolygonTool,
  },
  {
    icon: '✒️',
    title: 'line',
    tool: lineTool,
  },
  {
    icon: '✏️',
    title: 'drawing',
    tool: drawingTool,
  },
  {
    icon: '🖼️',
    title: 'image',
    tool: imageTool,
  },
  {
    icon: '🔠',
    title: 'text',
    tool: textTool,
  },
]);
const currentTool = ref<{ icon: string; title: string; tool: () => Tool }>(tools[0]);

watchEffect(() => {
  app.setTool(currentTool.value.tool());
});

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
        <div class="icon">🎨</div>
        <section class="shapes-section">
          <div class="tools-horizontal">
            <label v-for="({ icon, tool, title }, index) in tools" :key="index" class="tool-icon">
              <input v-model="currentTool" type="radio" :value="{ icon, tool, title }" />
              <div>{{ icon }}</div>
            </label>
          </div>
        </section>
        <div>
          <div class="undo-redo-buttons">
            <label class="tool-icon">
              <div @click="app.undo()">↩️</div>
            </label>
            <label class="tool-icon">
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

.icon {
  font-family: 'AlimamaFangYuanTi';
  font-size: 36px;
  color: rgb(32, 33, 35);
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
}
</style>
