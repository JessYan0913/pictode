<script setup lang="ts">
import { computed } from 'vue';

import Dialog from '@/components/Dialog.vue';

import Button from './Button.vue';

const props = defineProps<{
  visible: boolean;
  title: string;
  message: string;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
  (event: 'submit'): void;
}>();

const dialogVisible = computed<boolean>({
  get() {
    return props.visible;
  },
  set(visible: boolean) {
    emits('update:visible', visible);
    if (!visible) {
      emits('close');
    }
  },
});

const closeModal = () => {
  dialogVisible.value = false;
};

const onConfirmed = () => {
  emits('submit');
  closeModal();
};
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <template #title>
      <div as="h3" class="text-lg font-medium leading-6">{{ $t(title) }}</div>
    </template>
    <div class="flex flex-col">
      <div class="mt-3">
        <p class="text-sm text-gray-500">
          {{ $t(message) }}
        </p>
      </div>

      <div class="mt-4 flex flex-row justify-between">
        <Button
          class="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-red-50 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          :title="$t('关闭')"
          :text="$t('关闭')"
          @click="closeModal"
        >
        </Button>
        <Button
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-blue-50 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          :title="$t('确认')"
          :text="$t('确认')"
          @click="onConfirmed"
        >
        </Button>
      </div>
    </div>
  </Dialog>
</template>
