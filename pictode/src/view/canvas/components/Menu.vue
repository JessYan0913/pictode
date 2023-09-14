<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { injectStrict, useCommandComponent } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { PictodeAppKey } from '@/constants/inject-key';
import { MimeType } from '@/constants/mime-type';
import useExport from '@/hooks/useExport';
import useReadFileContent from '@/hooks/useReadFileContent';

import ExportImageDialog from './ExportImageDialog.vue';

interface MenuConfig {
  icon: string;
  label: string;
  handler: () => void;
}

const app = injectStrict(PictodeAppKey);

const exportImageDialog = useCommandComponent(ExportImageDialog);
const messageBox = useCommandComponent(MessageBox);
const { execute: exportToFile } = useExport(
  () => app.toJSON(),
  () => `Pictode-${new Date()}.pictode`,
  MimeType.JSON,
  'utf-8'
);
const { execute: readFileContent } = useReadFileContent();

const menuGroups: MenuConfig[][] = [
  [
    {
      icon: 'folder-close',
      label: '打开',
      handler: async () => {
        const result = await readFileContent(['.pictode']);
        result && app.fromJSON(result);
      },
    },
    {
      icon: 'hard-disk-one',
      label: '保存到本地',
      handler: () => {
        exportToFile();
      },
    },
    {
      icon: 'down-picture',
      label: '导出图片',
      handler: () => {
        exportImageDialog({});
      },
    },
    {
      icon: 'clear',
      label: '重置画布',
      handler: () => {
        messageBox({
          title: '清除画布',
          message: '将会清空画布内容，是否继续？',
          onSubmit: () => {
            app.clear();
            messageBox.close();
          },
        });
      },
    },
  ],
];
</script>

<template>
  <Menu as="div">
    <MenuButton class="outline-none flex justify-start">
      <SvgIcon name="logo" size="3rem"></SvgIcon>
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div class="relative">
        <MenuItems
          class="absolute mt-2 w-56 p-1 divide-y rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div v-for="(menus, index) in menuGroups" :key="index" class="px-1 py-1">
            <MenuItem v-slot="{ active }" v-for="(menu, index) in menus" :key="index">
              <button
                :class="[
                  active ? 'bg-blue-100' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
                @click="menu.handler"
              >
                <div class="flex flex-row gap-2">
                  <SvgIcon :name="menu.icon"></SvgIcon>
                  <span>{{ menu.label }}</span>
                </div>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </div>
    </transition>
  </Menu>
</template>
