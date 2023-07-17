import { EventArgs, EventBus } from './event';

type Method = (...args: any[]) => any;

export interface Middleware {
  (args: any[], next: Method): any;
}

export interface Plugin {
  before: Middleware[];
  after: Middleware[];
}

export class BaseService<T extends EventArgs = EventArgs> extends EventBus<T> {
  private pluginMap: Map<string, Plugin> = new Map();
  private middlewareMap: Map<string, Middleware[]> = new Map();

  constructor() {
    super();
    return new Proxy(this, {
      get: (target: BaseService<T>, prop: string) => {
        const originMethod = Reflect.get(target, prop);
        if (typeof originMethod !== 'function' || ['usePlugin', 'useMiddleware'].includes(prop)) {
          return originMethod;
        }
        const middlewareList = this.middlewareMap.get(prop) ?? [];
        const plugin = this.pluginMap.get(prop);

        return (...args: any[]) => {
          return this.applyMiddleware(middlewareList, args, async () => {
            let result: any;

            if (plugin) {
              result = await this.applyPlugins(originMethod, plugin, args, result);
            } else {
              result = await originMethod.call(this, ...args);
            }

            return result;
          });
        };
      },
    });
  }

  public usePlugin(method: string, plugin: Plugin) {
    if (!this.pluginMap.has(method)) {
      this.pluginMap.set(method, { before: [], after: [] });
    }
    const existingPlugin = this.pluginMap.get(method)!;
    existingPlugin.before.push(...plugin.before);
    existingPlugin.after.push(...plugin.after);
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

  private async applyPlugins(method: Method, plugin: Plugin, args: any[], result: any) {
    let beforeArgs = args;

    for (const middleware of plugin.before) {
      beforeArgs = await this.applyMiddleware([middleware], beforeArgs, () => beforeArgs);
      if (beforeArgs instanceof Error) {
        throw beforeArgs;
      }
      if (!Array.isArray(beforeArgs)) {
        beforeArgs = [beforeArgs];
      }
    }

    result = await method.call(this, ...beforeArgs);

    for (const middleware of plugin.after) {
      result = await this.applyMiddleware([middleware], [result, ...beforeArgs], () => result);
      if (result instanceof Error) {
        throw result;
      }
    }

    return result;
  }
}

export default BaseService;
