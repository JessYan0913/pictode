<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { injectStrict, useCommandComponent } from '@pictode/vue-aide';

import Button from '@/components/Button.vue';
import { PictodeAppKey, PictodeHotKeyActionsKey } from '@/constants/inject-key';
import { MimeType } from '@/constants/mime-type';
import useExport from '@/hooks/useExport';

import ExportImageDialog from './ExportImageDialog.vue';

interface MenuConfig {
  icon: string;
  label: string;
  hotkey?: string;
  handler: () => void;
}

const app = injectStrict(PictodeAppKey);
const { open, resetStage } = injectStrict(PictodeHotKeyActionsKey);

const exportImageDialog = useCommandComponent(ExportImageDialog);
const { execute: exportToFile } = useExport(
  () => app.toJSON(),
  () => `Pictode-${new Date()}.pictode`,
  MimeType.JSON,
  'utf-8'
);

const menuGroups: MenuConfig[][] = [
  [
    {
      icon: 'folder-close',
      label: '打开',
      hotkey: open.hotKey?.join('+'),
      handler: open,
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
      hotkey: resetStage.hotKey?.join('+'),
      handler: resetStage,
    },
  ],
];
</script>

<template>
  <Menu as="div">
    <MenuButton class="outline-none flex justify-start">
      <iconpark-icon name="logo" width="3rem" height="3rem"></iconpark-icon>
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
              <Button
                :class="[
                  active ? 'bg-blue-100' : 'text-gray-900',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
                :title="menu.label"
                @click="menu.handler"
              >
                <div class="w-full flex flex-row justify-between gap-2">
                  <iconpark-icon :name="menu.icon"></iconpark-icon>
                  <span class="flex-1 text-start">{{ menu.label }}</span>
                  <span>{{ menu.hotkey }}</span>
                </div>
              </Button>
            </MenuItem>
          </div>
        </MenuItems>
      </div>
    </transition>
  </Menu>
</template>
