<script setup lang="ts">
import { ref } from 'vue';

import ColorPicker from '@/components/ColorPicker.vue';

const color = ref('#1e88e5');
</script>

<template>
  <div class="w-full h-full bg-slate-300">
    <div class="w-full h-full flex flex-col justify-end items-end">
      <ColorPicker v-model="color"></ColorPicker>
    </div>
  </div>
</template>
