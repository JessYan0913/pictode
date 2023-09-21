<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCommandComponent } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import Select from '@/components/Select.vue';
import SelectOption from '@/components/SelectOption.vue';
import useContextMenu from '@/hooks/useContextMenu';
import useHotKeyActions from '@/hooks/useHotKeyActions';
import usePictode from '@/hooks/usePictode';
import useTheme from '@/hooks/useTheme';
import { languages } from '@/locales';

import HotKeyList from './components/HotKeyList.vue';
import Menu from './components/Menu.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import Tools from './components/Tools.vue';

const { triggerTheme, theme } = useTheme();

const { app, selected, scale } = usePictode();

const { undo, redo } = useHotKeyActions(app, selected);

useContextMenu(app, selected);

const canvasRef = ref<HTMLDivElement>();

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

const onTriggerTheme = () => triggerTheme();

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
        <Menu class="pointer-events-auto rounded-lg ring-1 ring-slate-950 dark:ring-navyBlue-100"></Menu>
      </section>
      <section class="row-start-1 col-start-2 justify-self-stretch">
        <Tools
          class="pointer-events-auto w-full rounded-lg p-2 ring-1 ring-slate-950 dark:ring-navyBlue-100 bg-white dark:bg-navyBlue-200"
        ></Tools>
      </section>
      <section class="row-start-1 col-start-3 justify-self-end">
        <div
          class="grid grid-flow-col gap-1 items-center w-full pointer-events-auto rounded-lg p-1 ring-1 ring-slate-950 dark:ring-navyBlue-100 bg-white dark:bg-navyBlue-200"
        >
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 text-lg dark:text-gray-300"
            :icon="theme === 'dark' ? 'sun' : 'moon'"
            @click="onTriggerTheme"
          >
          </Button>
          <Select v-model="$i18n.locale">
            <template #listbox>
              <Button
                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 text-lg dark:text-gray-300"
                :title="$t('语言')"
                icon="translate"
              >
              </Button>
            </template>
            <div
              class="absolute z-50 mt-3 mr-10 max-h-60 left-[-30px] w-fit rounded-lg bg-white dark:bg-navyBlue-200 py-1 text-base shadow-lg ring-1 ring-slate-950 dark:ring-navyBlue-100 focus:outline-none sm:text-sm"
            >
              <SelectOption
                v-for="({ label, value }, index) in languages"
                :key="index"
                :value="value"
                :label="label"
                class="p-1"
              ></SelectOption>
            </div>
          </Select>
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 text-lg dark:text-gray-300"
            :title="$t('帮助中心')"
            icon="helpcenter"
            @click="hotKeyList({})"
          >
          </Button>
        </div>
      </section>
      <section class="row-start-2 col-start-3 justify-self-end">
        <PropertyPanel
          class="p-4 w-56 shadow-md rounded-lg ring-1 ring-slate-950 dark:ring-navyBlue-100 bg-white dark:bg-navyBlue-200 pointer-events-auto"
        ></PropertyPanel>
      </section>
      <section class="row-start-3 col-start-1 justify-self-start flex flex-row gap-2">
        <div
          class="grid grid-flow-col gap-1 items-center w-full pointer-events-auto rounded-lg p-1 ring-1 ring-slate-950 dark:ring-navyBlue-100 bg-white dark:bg-navyBlue-200"
        >
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
            icon="minus"
            :title="$t('缩小')"
            @click="onClickZoomOut"
          ></Button>
          <div class="flex text-center text-sm text-slate-900 dark:text-gray-300 h-full items-center select-none">
            {{ displayScale }}
          </div>
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
            icon="plus"
            :title="$t('放大')"
            @click="onClickZoomIn"
          ></Button>
        </div>
        <div
          class="grid grid-flow-col gap-1 items-center w-full pointer-events-auto rounded-lg p-1 ring-1 ring-slate-950 dark:ring-navyBlue-100 bg-white dark:bg-navyBlue-200"
        >
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
            icon="undo"
            :title="$t('撤销')"
            @click="onClickUndo"
          ></Button>
          <Button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navyBlue-100 dark:text-gray-300"
            icon="redo"
            :title="$t('重做')"
            @click="onClickRedo"
          ></Button>
        </div>
      </section>
    </div>
    <div ref="canvasRef" class="w-full h-full dark:bg-navyBlue-300"></div>
  </div>
</template>
