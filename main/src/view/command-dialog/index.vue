<script setup lang="ts">
import { ElButton } from 'element-plus';

import { useCommandComponent } from '../../hooks/useCommandComponent';

import Comp from './components/Comp.vue';
import MyDialog from './components/MyDialog.vue';

const myDialog = useCommandComponent(MyDialog);
</script>

<template>
  <div>
    <ElButton @click="myDialog({ title: '父组件弹窗' })"> 打开弹窗 </ElButton>
    <Comp text="子组件1"></Comp>
    <Comp text="子组件2"></Comp>
  </div>
</template>
