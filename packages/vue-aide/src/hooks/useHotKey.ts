import { Ref } from 'vue';

import useEventListener from './useEventListener';

export interface HotKeyOptions {
  target: Ref<EventTarget> | EventTarget;
  shiftKey: boolean;
  ctrKey: boolean;
  exact: boolean;
}

export const useHotKey = (key: string, onKeyPressed: () => void, opts?: Partial<HotKeyOptions>) => {
  const target = opts?.target ?? window;
  useEventListener(target, 'keydown', (event) => {
    const options = opts || {};
    if (event.key === key && matchKeyScheme(options, event)) {
      event.preventDefault();
      onKeyPressed();
    }
  });
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
