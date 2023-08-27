import { Ref } from 'vue';

import { useEventListener } from './useEventListener';

export const useOnEventOutside = (
  event: 'mousedown' | 'mouseup' | 'mousemove' | 'dblclick' | 'click',
  rootEl: Ref<HTMLElement | null>,
  callback: () => any
) => {
  useEventListener(window, event, (e: Event) => {
    const clickedEl = e.target as HTMLElement;
    if (rootEl.value?.contains(clickedEl)) {
      return;
    }
    callback();
  });
};

export default useOnEventOutside;
