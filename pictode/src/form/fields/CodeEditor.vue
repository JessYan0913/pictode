<script setup lang="ts">
import { ref } from 'vue';
import Codemirror from 'codemirror';

import { CodeEditorConfig, FormValue } from '../types';

const codeEditorRef = ref<HTMLDivElement>();

withDefaults(
  defineProps<{
    config: CodeEditorConfig;
    prop: string;
    model?: FormValue;
  }>(),
  {
    model: () => ({}),
  }
);

console.log('====>', Codemirror);
</script>

<template>
  <div ref="codeEditorRef">代码编辑器</div>
</template>
