<script setup lang="ts">
import usePictode from '@/hooks/usePictode';

import RadioGroup from './RadioGroup.vue';
import RadioGroupOption from './RadioGroupOption.vue';
import SvgIcon from './SvgIcon.vue';

const { currentTool, tools } = usePictode();
</script>

<template>
  <RadioGroup v-model="currentTool">
    <RadioGroupOption v-for="(item, index) in tools" :key="index" :value="item.name">
      <SvgIcon :name="item.icon"></SvgIcon>
    </RadioGroupOption>
  </RadioGroup>
</template>
