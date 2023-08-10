<script setup lang="ts">
import usePictode from '@/hooks/usePictode';

import Radio from './Radio.vue';
import RadioGroup from './RadioGroup.vue';
import SvgIcon from './SvgIcon.vue';

const { currentTool, tools } = usePictode();
</script>

<template>
  <RadioGroup v-model="currentTool">
    <Radio v-for="(item, index) in tools" :key="index" :value="item.name">
      <SvgIcon :name="item.icon"></SvgIcon>
    </Radio>
  </RadioGroup>
</template>
