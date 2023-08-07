import { inject, InjectionKey } from 'vue';

export const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`);
  }
  return resolved;
};
