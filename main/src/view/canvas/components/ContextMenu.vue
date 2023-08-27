<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useOnEventOutside } from '@pictode/vue-aide';

const props = defineProps<{
  visible: boolean;
  x: number;
  y: number;
}>();

const popoverRef = ref<HTMLElement | null>(null);

const emits = defineEmits<{
  (event: 'update:visible', visible: boolean): void;
  (event: 'close'): void;
}>();

const popoverVisible = computed<boolean>({
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

useOnEventOutside('mousedown', popoverRef, () => {
  popoverVisible.value = false;
});

const onContextmenu = (e: MouseEvent) => {
  e.preventDefault();
};

onMounted(() => {
  if (popoverRef.value) {
    popoverRef.value.addEventListener('contextmenu', onContextmenu, false);
  }
});

onUnmounted(() => {
  if (popoverRef.value) {
    popoverRef.value.removeEventListener('contextmenu', onContextmenu, false);
  }
});

const menuGroups = [
  [
    {
      name: '上移一层',
    },
    {
      name: '下移一层',
    },
    {
      name: '置于顶层',
    },
    {
      name: '置于底层',
    },
  ],
  [
    {
      name: '上移一层',
    },
    {
      name: '下移一层',
    },
    {
      name: '置于顶层',
    },
    {
      name: '置于底层',
    },
  ],
];
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-1 opacity-0"
  >
    <div
      v-if="popoverVisible"
      :style="{ left: `${Math.max(x - 2, 0)}px`, top: `${Math.max(y - 2, 0)}px` }"
      class="absolute w-screen max-w-sm transform"
    >
      <div
        ref="popoverRef"
        class="absolute w-56 p-1 divide-y rounded-sm bg-gray-50 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div v-for="(menus, index) in menuGroups" :key="index" class="py-1">
          <div
            v-for="(item, index) in menus"
            :key="index"
            class="flex items-center cursor-default rounded-sm p-2 transition duration-150 ease-in-out hover:bg-blue-200"
          >
            <div>
              <p class="text-sm font-medium text-gray-700">
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
