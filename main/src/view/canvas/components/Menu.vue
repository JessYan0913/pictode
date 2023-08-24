<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useCommandComponent } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { MimeType } from '@/constants/mime-type';
import useExport from '@/hooks/useExport';
import usePictode from '@/hooks/usePictode';
import useReadFileContent from '@/hooks/useReadFileContent';

import ExportImageDialog from './ExportImageDialog.vue';

interface MenuConfig {
  label: string;
  handler: () => void;
}

const { app } = usePictode();

const exportImageDialog = useCommandComponent(ExportImageDialog);
const messageBox = useCommandComponent(MessageBox);
const { execute: exportToFile } = useExport(() => app.toJSON(), 'file.pictode', MimeType.JSON, 'utf-8');
const { execute: readFileContent } = useReadFileContent();

const menuGroups: MenuConfig[][] = [
  [
    {
      label: '打开',
      handler: async () => {
        const result = await readFileContent(['.pictode']);
        result && app.fromJSON(result);
      },
    },
    {
      label: '保存到本地',
      handler: () => {
        exportToFile();
      },
    },
    {
      label: '导出图片',
      handler: () => {
        exportImageDialog({});
      },
    },
    {
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
                @click="menu.handler()"
              >
                {{ menu.label }}
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </div>
    </transition>
  </Menu>
</template>
