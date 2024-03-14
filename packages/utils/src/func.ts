export interface ThrottleWrapper {
  (...args: any[]): void;
  cancel: () => void;
}

export type DebounceWrapper = (...args: any[]) => void;

export const emptyFn = (): any => undefined;

/**
 * 阻塞函数
 *
 * @param ms
 * @returns
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });

/**
 * 函数柯里化
 *
 * @param fun
 * @returns
 */
export function curryFunction(fun: Function): Function {
  return function curried(this: any, ...args: any[]) {
    if (args.length >= fun.length) {
      return fun.apply(this, args);
    } else {
      return function (this: any, ...args1: any[]) {
        return curried.apply(this, args.concat(args1));
      };
    }
  };
}

/**
 * 函数节流
 *
 * @param callback
 * @param delay
 * @returns
 */
export function throttle(callback: Function, delay: number): ThrottleWrapper {
  let lastExec: number = 0;
  let timerId: any = undefined;
  let canceled: boolean = false;

  const wrapper: ThrottleWrapper = function (this: any, ...args: any[]) {
    if (canceled) {
      return;
    }
    const elapsed = Date.now() - lastExec;

    const exec = () => {
      lastExec = Date.now();
      callback.apply(this, args);
    };

    if (timerId) {
      clearTimeout(timerId);
      timerId = undefined;
    }

    if (elapsed > delay) {
      exec();
    } else {
      timerId = setTimeout(exec, delay - elapsed);
    }
  };

  wrapper.cancel = () => {
    timerId && clearTimeout(timerId);
    lastExec = 0;
    timerId = undefined;
    canceled = true;
  };

  return wrapper;
}

/**
 * 函数防抖
 *
 * @param callback
 * @param delay
 * @returns
 */
export function debounce(callback: Function, delay: number): DebounceWrapper {
  let timerId: any = undefined;
  return function (this: any, ...args: any[]) {
    if (!timerId) {
      callback.apply(this, args);
    } else {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = undefined;
    }, delay);
  };
}
