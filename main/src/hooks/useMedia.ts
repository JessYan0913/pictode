import { Ref, ref, unref } from 'vue';

import useEventListener from './useEventListener';

export const useMedia = (query: Ref<string> | string) => {
  const mediaQuery = window.matchMedia(unref(query));
  const matches = ref<boolean>(mediaQuery.matches);
  useEventListener(mediaQuery, 'change', (event) => {
    matches.value = event.matches;
  });
  return matches;
};

export default useMedia;
