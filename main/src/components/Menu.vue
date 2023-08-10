<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

import SvgIcon from '@/components/SvgIcon.vue';
</script>

<template>
  <Popover class="relative">
    <PopoverButton class="outline-none flex justify-start">
      <SvgIcon name="logo" size="4rem"></SvgIcon>
    </PopoverButton>

    <PopoverPanel class="bg-opacity-88 shadow-md rounded-lg p-2 relative transition-shadow flex justify-center">
      <div class="grid">
        <h1 class="text-3xl font-bold underline bg-blue-500 hover:bg-sky-700">Hello world!</h1>
      </div>
    </PopoverPanel>
  </Popover>
</template>
