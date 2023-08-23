<script setup lang="ts">
import { computed } from 'vue';
import { DialogTitle } from '@headlessui/vue';

import Dialog from '@/components/Dialog.vue';

const props = defineProps<{
  visible: boolean;
  title: string;
  message: string;
}>();

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
  (event: 'confirm'): void;
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

const onConfirm = () => {
  emits('confirm');
  closeModal();
};
</script>

<template>
  <Dialog :visible="dialogVisible" @close="closeModal">
    <div class="flex flex-col">
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> {{ title }} </DialogTitle>
      <div class="mt-2">
        <p class="text-sm text-gray-500">
          {{ message }}
        </p>
      </div>

      <div class="mt-4 flex flex-row justify-between">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-red-50 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          @click="closeModal"
        >
          关闭
        </button>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-blue-50 hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="onConfirm"
        >
          确认
        </button>
      </div>
    </div>
  </Dialog>
</template>
