<script setup lang="ts">
import { ref } from 'vue';

import RadioGroup from './RadioGroup.vue';
import RadioGroupOption from './RadioGroupOption.vue';

const color = ref<string>();

const themeColors = ['#f43f5e', '#ec4899'];
</script>

<template>
  <RadioGroup v-model="color">
    <RadioGroupOption v-for="(themeColor, index) in themeColors" :key="index" :value="themeColor">
      <div :style="{ backgroundColor: themeColor }" class="w-8 h-8"></div>
    </RadioGroupOption>
  </RadioGroup>
</template>
