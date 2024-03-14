import { EventArgs, EventBus } from './event';

type Method = (...args: any[]) => any;

export type Middleware = (args: any[], next: Method) => any;

export class BaseService<T extends EventArgs = EventArgs> extends EventBus<T> {
  constructor() {
    super();
  }
}

export default BaseService;
