import { Modifier } from '../types';

export const matchKeyScheme = (
  opts: Pick<Partial<Modifier>, 'shiftKey' | 'altKey' | 'ctrlKey' | 'exact'>,
  event: WheelEvent,
  isWindows: boolean,
): boolean => {
  const ctrlKey = opts.ctrlKey ?? false;
  const shiftKey = opts.shiftKey ?? false;
  const altKey = opts.altKey ?? false;
  if (opts.exact) {
    return (
      ctrlKey === (isWindows ? event.ctrlKey : event.metaKey) && shiftKey === event.shiftKey && altKey === event.altKey
    );
  }
  const satisfiedKeys: boolean[] = [];
  satisfiedKeys.push(ctrlKey === (isWindows ? event.ctrlKey : event.metaKey));
  satisfiedKeys.push(shiftKey === event.shiftKey);
  satisfiedKeys.push(altKey === event.altKey);
  return satisfiedKeys.every((item) => item);
};
