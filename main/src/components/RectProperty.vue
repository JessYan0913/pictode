<script setup lang="ts">
import { reactive, ref } from 'vue';

import SvgIcon from '@/components/SvgIcon.vue';

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
  cornerRadius: 25,
  opacity: 1,
});

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);
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
            <input v-model="rectProperty.strokeWidth" type="radio" :value="2" />
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
            <input v-model="rectProperty.strokeWidth" type="radio" :value="4" />
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
            <input v-model="rectProperty.cornerRadius" type="radio" :value="25" />
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
