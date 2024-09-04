import { ref, watch, watchEffect } from 'vue';
import { useMedia } from '@pictode/vue-aide';

const LOCAL_STORAGE_THEME = '__theme__';

const theme = ref<string>(localStorage.getItem(LOCAL_STORAGE_THEME) ?? 'light');

const media = useMedia('(prefers-color-scheme: dark)');

watch(
  () => media,
  () => {
    if (media.value) {
      theme.value = 'dark';
    } else {
      theme.value = 'light';
    }
  },
);

watchEffect(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem(LOCAL_STORAGE_THEME, theme.value);
});

export const useTheme = () => {
  const triggerTheme = (value?: 'dark' | 'light') => {
    if (value === void 0) {
      theme.value = theme.value === 'dark' ? 'light' : 'dark';
    } else {
      theme.value = value;
    }
  };
  return {
    theme,
    triggerTheme,
  };
};

export default useTheme;
