import logger from './logger';

type EnabledTarget = { enabled: boolean };

export function EnabledCheck<T extends EnabledTarget>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (this: T, ...args: any[]) {
    if (this.enabled) {
      return originalMethod.apply(this, args);
    } else {
      logger.warning(`Method {{${propertyKey}}} is disabled.`);
      // 可以选择抛出错误或执行其他操作
    }
  };

  return descriptor;
}
