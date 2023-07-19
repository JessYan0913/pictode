import { EventArgs, EventBus } from './event';

type Method = (...args: any[]) => any;

export interface Middleware {
  (args: any[], next: Method): any;
}

export class BaseService<T extends EventArgs = EventArgs> extends EventBus<T> {
  private middlewareMap: Map<string, Middleware[]> = new Map();

  constructor() {
    super();
    return new Proxy(this, {
      get: (target: BaseService<T>, prop: string) => {
        const originMethod = Reflect.get(target, prop);
        if (typeof originMethod !== 'function' || ['useMiddleware'].includes(prop)) {
          return originMethod;
        }
        const middlewareList = this.middlewareMap.get(prop) ?? [];

        return (...args: any[]) => {
          return this.applyMiddleware(middlewareList, args, async () => {
            let result: any;

            result = await originMethod.call(this, ...args);
            return result;
          });
        };
      },
    });
  }

  public useMiddleware(method: string, middleware: Middleware) {
    if (!this.middlewareMap.has(method)) {
      this.middlewareMap.set(method, []);
    }
    this.middlewareMap.get(method)!.push(middleware);
  }

  private async applyMiddleware(middlewareList: Middleware[], args: any[], next: Method) {
    let index = -1;
    const dispatch = async (i: number): Promise<any> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      const middleware = middlewareList[i];
      if (!middleware) {
        return next(...args);
      }

      return middleware(args, dispatch.bind(this, i + 1));
    };

    return dispatch(0);
  }
}

export default BaseService;
