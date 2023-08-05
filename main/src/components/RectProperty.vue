<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue';

import SvgIcon from '@/components/SvgIcon.vue';
import { usePictode } from '@/hooks/usePictode';

const { app, selected } = usePictode();

const rectProperty = reactive<{
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
}>({
  fill: 'rgba(256,256,256,0)',
  stroke: 'rgba(0,0,0,1)',
  strokeWidth: 2,
  cornerRadius: 10,
  opacity: 1,
});

const predefineColors = ref<string[]>([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#c7158577',
]);

watchEffect(() => {
  if (selected.value.length === 1) {
    const selectedNode = selected.value[0].toObject();
    rectProperty.fill = selectedNode.attrs.fill;
    rectProperty.cornerRadius = selectedNode.attrs.cornerRadius;
    rectProperty.stroke = selectedNode.attrs.stroke;
    rectProperty.strokeWidth = selectedNode.attrs.strokeWidth;
    rectProperty.opacity = selectedNode.attrs.opacity ?? 1;
  }
});

watch(
  () => rectProperty,
  () => {
    const newNode = { ...selected.value?.[0].toObject() };
    newNode.attrs = { ...newNode.attrs, ...rectProperty };
    app.update(newNode);
  },
  { deep: true }
);
</script>

<template>
  <div>
    <el-form label-position="top" size="small" label-width="100px" :model="rectProperty" style="max-width: 202px">
      <el-form-item label="背景" prop="fill">
        <el-color-picker v-model="rectProperty.fill" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="边框" prop="stroke">
        <el-color-picker v-model="rectProperty.stroke" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="边框宽度" prop="strokeWidth">
        <div class="button-list">
          <label class="tool-icon">
            <input v-model="rectProperty.strokeWidth" type="radio" :value="1" />
            <div>
              <SvgIcon name="line-1"></SvgIcon>
            </div>
          </label>
          <label class="tool-icon">
            <input v-model="rectProperty.strokeWidth" type="radio" :value="3" />
            <div>
              <SvgIcon name="line-2"></SvgIcon>
            </div>
          </label>
          <label class="tool-icon">
            <input v-model="rectProperty.strokeWidth" type="radio" :value="5" />
            <div>
              <SvgIcon name="line-3"></SvgIcon>
            </div>
          </label>
        </div>
      </el-form-item>
      <el-form-item label="边角" prop="cornerRadius">
        <div class="button-list">
          <label class="tool-icon">
            <input v-model="rectProperty.cornerRadius" type="radio" :value="0" />
            <div>
              <SvgIcon name="node-flat"></SvgIcon>
            </div>
          </label>
          <label class="tool-icon">
            <input v-model="rectProperty.cornerRadius" type="radio" :value="10" />
            <div>
              <SvgIcon name="node-round"></SvgIcon>
            </div>
          </label>
        </div>
      </el-form-item>
      <el-form-item label="透明度" props="opacity">
        <el-slider v-model="rectProperty.opacity" :min="0" :max="1" :step="0.01" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.button-list {
  flex-wrap: wrap;
  display: flex;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
}

.tool-icon {
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  div {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
  }

  & > input {
    position: absolute;
    opacity: 0;
  }

  & > input:checked + div {
    background: #e3e2fe;
  }
}
</style>
