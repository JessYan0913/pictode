<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useRouterCache } from '@/hooks/useRouterCache';

const { keepAliveComps } = useRouterCache();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive :include="keepAliveComps">
      <component :is="Component"></component>
    </KeepAlive>
  </RouterView>
</template>
