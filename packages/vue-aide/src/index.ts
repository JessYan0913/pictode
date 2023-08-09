import { inject, InjectionKey, isRef, MaybeRefOrGetter, Ref, unref } from 'vue';

export * from './hooks';

export const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`);
  }
  return resolved;
};

export const unravel = <T>(value: MaybeRefOrGetter<T>): T => {
  if (typeof value === 'function') {
    return (value as Function)();
  }
  return unref(value);
};

export const isWatchable = <T>(value: MaybeRefOrGetter<T>): value is Ref<T> | (() => T) => {
  return isRef(value) || typeof value === 'function';
};
