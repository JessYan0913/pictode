import { Ref, unref } from 'vue';

import useEventListener from './useEventListener';

export interface HotKeyOptions {
  key: string | string[];
  target: Ref<EventTarget | null> | EventTarget | null;
  directions: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  exact: boolean; // 当 exact 设置为 true 时，表示在判断快捷键是否匹配时，不仅要考虑按下的按键是否匹配，还需要考虑是否同时满足 Ctrl 键和 Shift 键的状态
}

export interface HotKeyFunction {
  (...args: any[]): any;
  hotKey?: (string | string[])[];
  directions?: string;
  pause?: () => void;
  unpause?: () => void;
  removeListener?: () => void;
}

export const useHotKey = (hotKeyFunction: HotKeyFunction, opts?: Partial<HotKeyOptions>): HotKeyFunction => {
  const target = opts?.target ?? window;
  const isMacOS = navigator.userAgent.toLowerCase().includes('mac');
  let paused: boolean = false;
  let key = opts?.key;

  const getHotKey = (): (string | string[])[] => {
    const options = opts || {};
    const keyCombination = [];
    if (options.ctrlKey) keyCombination.push(isMacOS ? 'Cmd' : 'Ctrl');
    if (options.shiftKey) keyCombination.push(isMacOS ? 'Option' : 'Shift');
    if (key) {
      keyCombination.push(key);
    }

    return keyCombination;
  };

  const handleKeydownEvent = (event: KeyboardEvent) => {
    event.stopPropagation();
    const options = opts || {};
    if (paused || !key) {
      return;
    }
    key = typeof key === 'string' ? [key] : key;
    if (key.includes(event.key.toLowerCase()) && matchKeyScheme(options, event)) {
      event.preventDefault();
      const result = hotKeyFunction();
      if (typeof result !== 'function') {
        return;
      }
      const targetElement: EventTarget = unref(target) ?? window;
      const handleKeyup = (event: Event) => {
        event.preventDefault();
        result();
        targetElement.removeEventListener('keyup', handleKeyup);
      };
      targetElement.addEventListener('keyup', handleKeyup);
    }
  };

  const removeListener = useEventListener(target, 'keydown', handleKeydownEvent);

  hotKeyFunction.hotKey = getHotKey();
  hotKeyFunction.directions = opts?.directions ?? '';
  hotKeyFunction.removeListener = removeListener;
  hotKeyFunction.pause = () => (paused = true);
  hotKeyFunction.unpause = () => (paused = false);
  return hotKeyFunction;
};

const matchKeyScheme = (
  opts: Pick<Partial<HotKeyOptions>, 'shiftKey' | 'ctrlKey' | 'exact'>,
  event: KeyboardEvent
): boolean => {
  const ctrlKey = opts.ctrlKey ?? false;
  const shiftKey = opts.shiftKey ?? false;
  if (opts.exact) {
    return (ctrlKey === event.metaKey || ctrlKey === event.ctrlKey) && shiftKey === event.shiftKey;
  }
  const satisfiedKeys: boolean[] = [];
  satisfiedKeys.push(ctrlKey === event.metaKey || ctrlKey === event.ctrlKey);
  satisfiedKeys.push(shiftKey === event.shiftKey);
  return satisfiedKeys.every((item) => item);
};

export default useHotKey;
