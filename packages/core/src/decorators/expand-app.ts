import { App } from '../app';
import { Plugin } from '../types';

export function expandApp<T extends Plugin = Plugin>(methodName?: string) {
  return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    methodName = methodName ?? propertyKey;
    Reflect.set(App.prototype, methodName, descriptor.value);
  };
}
