<script setup lang="ts">
import { computed } from 'vue';
import { ElDialog } from 'element-plus';

const props = defineProps<{
  visible: boolean;
  title?: string;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const dialogVisible = computed<boolean>({
  get() {
    return props.visible;
  },
  set(visible) {
    emits('update:visible', visible);
    if (!visible) {
      emits('close');
    }
  },
});
</script>

<template>
  <ElDialog v-model="dialogVisible" :title="title" width="30%">
    <span>This is a message</span>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </span>
    </template>
  </ElDialog>
</template>
