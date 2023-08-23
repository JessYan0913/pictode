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

      <div class="mt-4">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="closeModal"
        >
          确认
        </button>
      </div>
    </div>
  </Dialog>
</template>
