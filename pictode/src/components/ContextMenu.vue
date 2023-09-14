<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useOnEventOutside } from '@pictode/vue-aide';

interface Menu {
  icon?: string;
  label: string;
  action?: () => void;
  disable?: boolean;
  hotKey?: string;
}

type MenuGroups = Array<Array<Menu>>;

const props = withDefaults(
  defineProps<{
    visible: boolean;
    x: number;
    y: number;
    menuGroups?: MenuGroups;
  }>(),
  {
    menuGroups: () => [],
  }
);

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

const popoverStyle = computed(() => {
  const left = Math.max(props.x - 2, 0);
  const top = Math.max(props.y - 2, 0);
  const buffer = 12; // 调整菜单到边框的最小距离

  const menuWidth = 224; // 菜单的宽度，根据实际情况调整
  const menuHeight = props.menuGroups.flat().length * 40; // 假设每个菜单项的高度为40

  const rightOverflow = left + menuWidth - window.innerWidth + buffer;
  const bottomOverflow = top + menuHeight - window.innerHeight + buffer;

  return {
    left: rightOverflow > 0 ? `${left - rightOverflow}px` : `${left}px`,
    top: bottomOverflow > 0 ? `${top - bottomOverflow}px` : `${top}px`,
  };
});

const popoverMenuGroups = computed<MenuGroups>(() => props.menuGroups.filter((menus) => menus.length));

useOnEventOutside('mousedown', popoverRef, () => {
  popoverVisible.value = false;
});

const onContextmenu = (e: MouseEvent) => {
  e.preventDefault();
};

const onClickMenu = (menu: Menu) => {
  if (menu.disable) {
    return;
  }
  menu.action?.();
  popoverVisible.value = false;
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
    <div v-if="popoverVisible" :style="popoverStyle" class="absolute w-screen max-w-sm transform">
      <div
        ref="popoverRef"
        class="absolute w-56 py-1 divide-y rounded-sm bg-gray-50 shadow-md ring-1 ring-gray-600 ring-opacity-5 focus:outline-none"
      >
        <div v-for="(menus, index) in popoverMenuGroups" :key="index" class="py-1">
          <div
            v-for="(menu, index) in menus"
            :key="index"
            class="flex items-center py-2 px-4 transition duration-150 ease-in-out"
            :class="[menu.disable ? 'text-gray-300 cursor-default' : 'text-gray-700 hover:bg-blue-200 cursor-pointer']"
            @click="onClickMenu(menu)"
          >
            <div class="w-full grid grid-cols-[1rem_1fr_1.5fr] gap-2 text-sm font-medium select-none">
              <iconpark-icon v-if="menu.icon" :name="menu.icon"></iconpark-icon>
              <p>
                {{ menu.label }}
              </p>
              <p :class="[menu.disable ? '' : 'text-gray-400', 'text-end text-xs']">{{ menu.hotKey }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
body {
  overflow-x: hidden;
}
</style>
