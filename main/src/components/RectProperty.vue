<script setup lang="ts">
import { reactive, ref } from 'vue';

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
        <label>
          <input v-model="rectProperty.strokeWidth" type="radio" :value="2" />
          <div>2</div>
        </label>
        <label>
          <input v-model="rectProperty.strokeWidth" type="radio" :value="3" />
          <div>3</div>
        </label>
      </el-form-item>
      <el-form-item label="边角" prop="cornerRadius">
        <el-input v-model="rectProperty.cornerRadius" />
      </el-form-item>
      <el-form-item label="透明度" props="opacity">
        <el-slider v-model="rectProperty.opacity" :min="0" :max="1" :step="0.01" />
      </el-form-item>
    </el-form>
  </div>
</template>
