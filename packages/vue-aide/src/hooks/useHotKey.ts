import { computed, inject, Ref } from 'vue';

import { OSContextKey } from '../constants/inject-keys';

import useEventListener from './useEventListener';
import useOSContext from './useOSContext';

export interface HotKeyOptions {
  target: Ref<EventTarget> | EventTarget;
  shiftKey: boolean;
  ctrKey: boolean;
  exact: boolean;
}

export const useHotKey = (key: string, onKeyPressed: () => void, opts?: Partial<HotKeyOptions>) => {
  const target = opts?.target ?? window;
  let OSContext = inject(OSContextKey);
  if (!OSContext) {
    OSContext = useOSContext();
  }

  const hotKeyString = computed(() => {
    const options = opts || {};
    const keyCombination = [];

    if (options.ctrKey) keyCombination.push(OSContext?.OS === 'Windows' ? 'Ctrl' : 'Cmd');
    if (options.shiftKey) keyCombination.push('Shift');

    keyCombination.push(key);

    return keyCombination.join('+');
  });
  useEventListener(target, 'keydown', (event) => {
    const options = opts || {};
    if (event.key === key && matchKeyScheme(options, event)) {
      event.preventDefault();
      onKeyPressed();
    }
  });
  return hotKeyString;
};

const matchKeyScheme = (
  opts: Pick<Partial<HotKeyOptions>, 'shiftKey' | 'ctrKey' | 'exact'>,
  event: KeyboardEvent
): boolean => {
  const ctrKey = opts.ctrKey ?? false;
  const shiftKey = opts.shiftKey ?? false;
  if (opts.exact) {
    return ctrKey === event.ctrlKey && shiftKey === event.shiftKey;
  }
  const satisfiedKeys: boolean[] = [];
  satisfiedKeys.push(ctrKey === event.ctrlKey);
  satisfiedKeys.push(shiftKey === event.shiftKey);
  return satisfiedKeys.every((item) => item);
};

export default useHotKey;
