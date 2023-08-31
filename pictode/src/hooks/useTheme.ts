import { ref, watchEffect } from 'vue';

const LOCAL_STORAGE_THEME = '__theme__';

const theme = ref<string>(localStorage.getItem(LOCAL_STORAGE_THEME) ?? 'light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value ?? 'light');
  localStorage.setItem(LOCAL_STORAGE_THEME, theme.value);
});

export const useTheme = () => {
  return {
    theme,
  };
};

export default useTheme;
