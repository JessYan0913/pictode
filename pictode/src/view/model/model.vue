<script setup lang="ts">
import { defineExpose, onMounted, ref } from 'vue';
import { App, util } from '@pictode/core';
import { AlignmentPlugin } from '@pictode/plugin-alignment';
import { HistoryPlugin } from '@pictode/plugin-history';
import { SelectorPlugin } from '@pictode/plugin-selector';
import { ImageTool, SelectTool, TextTool } from '@pictode/tools';
import { Modal as AModal } from 'ant-design-vue';

const canvasRef = ref<HTMLDivElement>();
const selected = ref();

const app = new App();

const selectorPlugin = new SelectorPlugin();
const historyPlugin = new HistoryPlugin();
const alignmentPlugin = new AlignmentPlugin();

app.use(selectorPlugin);
app.use(historyPlugin);
app.use(alignmentPlugin);

app.on('selected:changed', ({ selected: newSelected }: any) => {
  selected.value = newSelected;
});

const selectTool = new SelectTool({
  hooks: {
    onActive() {
      selectorPlugin.enable();
    },
    onInactive() {
      selectorPlugin.disable();
    },
  },
});

const textTool = new TextTool({
  config: {
    stroke: 'black',
    strokeWidth: 2,
    fill: 'gray',
    cornerRadius: 0,
    opacity: 1,
  },
  hooks: {
    onActive() {
      app.cancelSelect();
    },
  },
});

app.setTool(textTool);

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});

const open = ref(true);
function handleOk() {
  open.value = false;
}

function openModal() {
  open.value = true;
}

const onClickImage = async () => {
  const files = await util.selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE', '.svg'], false);
  const imgSrc = await util.readeFile<string>((reader) => reader.readAsDataURL(files[0]));
  const imageTool = new ImageTool({
    config: {
      image: new Image(),
    },
  });
  imageTool.imageElement.src = imgSrc;
  app.setTool(null);
  app.setTool(imageTool);
};

defineExpose({
  openModal,
});
</script>

<template>
  <AModal v-model:open="open" title="test" @ok="handleOk">
    <div class="wrapper">
      <div ref="canvasRef" class="canvas"></div>
      <div class="tools">
        <button @click="app.setTool(selectTool)">选择</button>
        <button @click="app.setTool(textTool)">文本</button>
        <button @click="onClickImage">Image</button>
      </div>
      <div class="actions">
        <button @click="app.undo()">撤销</button>
        <button @click="app.redo()">重做</button>
      </div>
    </div>
  </AModal>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: gray;
}

.canvas {
  width: 400px;
  height: 400px;
  background: white;
}

.tools {
  display: flex;
}

.actions {
  display: flex;
}
</style>
