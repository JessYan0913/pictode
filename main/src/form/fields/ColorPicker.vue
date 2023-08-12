<script setup lang="ts">
import { ref } from 'vue';

const colors = ref('#333');
</script>

<template>
  <div class="w-7 h-7">
    <input v-model="colors" class="inline-block w-full h-full cursor-pointer" type="color" />
  </div>
</template>
