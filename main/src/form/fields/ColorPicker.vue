<script setup lang="ts">
import { ref } from 'vue';

const colors = ref('#333');
</script>

<template>
  <div>
    <input v-model="colors" type="color" />
  </div>
</template>
