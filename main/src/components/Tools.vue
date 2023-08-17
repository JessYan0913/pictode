<script setup lang="ts">
import useTools from '@/hooks/useTools';

import RadioGroup from './RadioGroup.vue';
import RadioGroupOption from './RadioGroupOption.vue';
import SvgIcon from './SvgIcon.vue';

const { currentTool, tools } = useTools();
</script>

<template>
  <RadioGroup v-model="currentTool">
    <RadioGroupOption v-for="(item, index) in tools" :key="index" :value="item.name">
      <SvgIcon :name="item.icon"></SvgIcon>
    </RadioGroupOption>
  </RadioGroup>
</template>
