import { EventEmitter } from 'events';

export interface EventArgs {
  [key: string | symbol]: any;
}

export class EventBus<T extends EventArgs = EventArgs> extends EventEmitter {
  constructor() {
    super();
  }

  public on<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.on(eventName as string, listener);
  }

  public addListener<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.on(eventName as string, listener);
  }

  public once<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.once(eventName as string, listener);
  }

  public removeListener<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.removeListener(eventName as string, listener);
  }

  public removeAllListeners<K extends keyof T>(event?: K): this {
    return super.removeAllListeners(event as string);
  }

  public emit<K extends keyof T>(eventName: K, payload: T[K]): boolean {
    return super.emit(eventName as string, payload);
  }

  public off<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.off(eventName as string, listener);
  }

  public listeners<K extends keyof T>(eventName: K): Function[] {
    return super.listeners(eventName as string);
  }

  public rawListeners<K extends keyof T>(eventName: K): Function[] {
    return super.rawListeners(eventName as string);
  }

  public listenerCount<K extends keyof T>(eventName: K): number {
    return super.listenerCount(eventName as string);
  }

  public prependListener<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.prependListener(eventName as string, listener);
  }

  public prependOnceListener<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.prependOnceListener(eventName as string, listener);
  }
}
