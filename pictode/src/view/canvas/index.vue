<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCommandComponent } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import Select from '@/components/Select.vue';
import useContextMenu from '@/hooks/useContextMenu';
import useHotKeyActions from '@/hooks/useHotKeyActions';
import usePictode from '@/hooks/usePictode';

import HotKeyList from './components/HotKeyList.vue';
import Menu from './components/Menu.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import Tools from './components/Tools.vue';

const { app, selected, scale } = usePictode();

const { undo, redo } = useHotKeyActions(app, selected);

useContextMenu(app, selected);

const canvasRef = ref<HTMLDivElement>();

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁体中文', value: 'zh-TW' },
  { label: 'English', value: 'en' },
];

const selectedLanguage = ref(languages[0]);

const displayScale = computed<string>(() => {
  return `${Math.ceil(scale.value * 100)}%`;
});

const hotKeyList = useCommandComponent(HotKeyList);

const onClickZoomIn = () => {
  app.scaleTo(scale.value + app.config.mousewheel.factor);
};

const onClickZoomOut = () => {
  app.scaleTo(scale.value - app.config.mousewheel.factor);
};

const onClickUndo = () => undo();

const onClickRedo = () => redo();

onMounted(() => {
  if (canvasRef.value) {
    app.mount(canvasRef.value);
  }
});
</script>

<template>
  <div class="w-full h-full">
    <div
      class="absolute left-0 top-0 right-0 bottom-0 p-8 z-10 pointer-events-none grid grid-cols-3 grid-rows-[auto_1fr_50px] gap-12"
    >
      <section class="row-start-1 col-start-1 justify-self-start">
        <Menu class="pointer-events-auto"></Menu>
      </section>
      <section class="row-start-1 col-start-2 justify-self-stretch">
        <Tools
          class="pointer-events-auto w-full shadow-md rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        ></Tools>
      </section>
      <section class="row-start-1 col-start-3 justify-self-end">
        <div
          class="grid grid-flow-col gap-4 items-center w-full pointer-events-auto rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        >
          <Select v-model="selectedLanguage" :options="languages">
            <template #listbox>
              <Button class="p-1 rounded-lg hover:bg-slate-200 text-lg" :title="$t('语言')" icon="translate"> </Button>
            </template>
          </Select>
          <Button
            class="p-1 rounded-lg hover:bg-slate-200 text-lg"
            :title="$t('帮助中心')"
            icon="helpcenter"
            @click="hotKeyList({})"
          >
          </Button>
        </div>
      </section>
      <section class="row-start-2 col-start-3 justify-self-end">
        <PropertyPanel
          class="p-4 w-56 shadow-md rounded-lg ring-1 ring-black bg-white ring-opacity-5 transition-shadow pointer-events-auto"
        ></PropertyPanel>
      </section>
      <section class="row-start-3 col-start-1 justify-self-start flex flex-row gap-2">
        <div
          class="grid grid-flow-col gap-2 items-center w-full pointer-events-auto rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        >
          <Button
            class="p-1 rounded-lg hover:bg-slate-200"
            icon="minus"
            :title="$t('缩小')"
            @click="onClickZoomOut"
          ></Button>
          <div class="flex text-center text-sm h-full items-center select-none">{{ displayScale }}</div>
          <Button
            class="p-1 rounded-lg hover:bg-slate-200"
            icon="plus"
            :title="$t('放大')"
            @click="onClickZoomIn"
          ></Button>
        </div>
        <div
          class="grid grid-flow-col gap-2 items-center w-full pointer-events-auto rounded-lg p-2 ring-1 ring-black bg-white ring-opacity-5 transition-shadow"
        >
          <Button
            class="p-1 rounded-lg hover:bg-slate-200"
            icon="undo"
            :title="$t('撤销')"
            @click="onClickUndo"
          ></Button>
          <Button
            class="p-1 rounded-lg hover:bg-slate-200"
            icon="redo"
            :title="$t('重做')"
            @click="onClickRedo"
          ></Button>
        </div>
      </section>
    </div>
    <div ref="canvasRef" class="w-full h-full"></div>
  </div>
</template>
