<script setup lang="ts">
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useRoutersStore } from '@/store/routers';

const routerStore = useRoutersStore();

const { keepAliveComps } = storeToRefs(routerStore);
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="keepAliveComps">
      <component :is="Component"></component>
    </KeepAlive>
  </RouterView>
</template>
