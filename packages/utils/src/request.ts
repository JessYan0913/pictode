import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { BaseError } from './error';

export interface HttpInterceptors {
  /** 请求拦截器 */
  requestInterceptor?: (config: InternalAxiosRequestConfig | AxiosRequestConfig) => InternalAxiosRequestConfig;
  /** 请求失败拦截器 */
  requestInterceptorCatch?: (error: any) => any;
  /** 响应拦截器 */
  responseInterceptor?: <T = AxiosResponse>(response: T) => T;
  /** 响应失败拦截器 */
  responseInterceptorCatch?: (error: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig {
  /** 自定义拦截器 */
  interceptors?: HttpInterceptors;
  /** 重试次数 */
  retry?: number;
  /** 重试间隔 */
  retryDelay?: number;
  /** 已重试次数 */
  retryCounted?: number;
  /** 重试状态 */
  retryStatus?: string[];
}

export interface RequestError extends AxiosError<any, any>, BaseError {
  config: RequestConfig & InternalAxiosRequestConfig;
}

export class Request {
  instance: AxiosInstance;
  requestCanceler: RequestCancel;
  interceptors?: HttpInterceptors;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    this.requestCanceler = new RequestCancel();

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 所有请求在这个状态都是待处理请求
        this.requestCanceler.pendingRequest(config);
        return config;
      },
      (error: RequestError) => {
        // 请求阶段出错则取消请求
        this.requestCanceler.cancelRequest(error.config);
        return error;
      }
    );

    // 用户自定义拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return new Promise((resolve, reject) => {
          // 请求此时已完成
          this.requestCanceler.confirmRequest(res.config);
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        });
      },
      async (err: RequestError) => {
        const { code = '', config } = err;
        // 配置中未开启重试，或异常状态不在重试状态中则无需重试
        if (!config?.retry || !config.retryStatus?.includes(code)) {
          return Promise.reject(err);
        }
        config.retryCounted = config.retryCounted ?? 0;
        if (config.retryCounted >= config.retry) {
          return Promise.reject(err);
        }

        config.retryCounted++;
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, config.retryDelay);
        });
        return await this.request(config);
      }
    );
  }

  /** 发出请求 */
  public request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        if (config.interceptors?.requestInterceptor) {
          config = config.interceptors?.requestInterceptor(config);
        }
        this.instance
          .request<any, T>(config)
          .then((res) => {
            if (config.interceptors?.responseInterceptor) {
              res = config.interceptors.responseInterceptor(res);
            }
            resolve(res);
          })
          .catch((err: any) => {
            if (config.interceptors?.responseInterceptorCatch) {
              err = config.interceptors?.responseInterceptorCatch(err);
            }
            reject(err);
          });
      } catch (error) {
        if (config.interceptors?.requestInterceptorCatch) {
          config.interceptors.requestInterceptorCatch(error);
        }
      }
    });
  }
}

export class RequestCancel<T extends AxiosRequestConfig = RequestConfig> {
  pendingRequestMap: Map<string, AbortController>;

  constructor() {
    this.pendingRequestMap = new Map();
  }

  async pendingRequest(config: T): Promise<void> {
    const requestId = await this.getRequestId(config);
    if (this.pendingRequestMap.has(requestId)) {
      config.signal = this.pendingRequestMap.get(requestId)?.signal;
    } else {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      this.pendingRequestMap.set(requestId, abortController);
    }
  }

  async confirmRequest(config: T): Promise<void> {
    if (this.pendingRequestMap.size === 0) {
      return;
    }
    const requestId = await this.getRequestId(config);
    if (!this.pendingRequestMap.has(requestId)) {
      return;
    }
    this.pendingRequestMap.delete(requestId);
  }

  async cancelRequest(config: T): Promise<void> {
    if (this.pendingRequestMap.size === 0) {
      return;
    }
    const requestId = await this.getRequestId(config);
    if (!this.pendingRequestMap.has(requestId)) {
      return;
    }
    this.pendingRequestMap.get(requestId)?.abort();
    this.pendingRequestMap.delete(requestId);
  }

  async cancelAllRequest(): Promise<void> {
    for (const abortController of this.pendingRequestMap.values()) {
      abortController.abort();
    }
    this.pendingRequestMap.clear();
  }

  private async getRequestId(config: T): Promise<string> {
    let { url, method, params, data } = config;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (typeof params === 'string') {
      params = JSON.parse(params);
    }
    return await objectHash({ url, method, params, data });

    async function objectHash(obj: Record<string, any>): Promise<string> {
      const result = await crypto.subtle.digest('SHA-256', string2ArrayBuffer(JSON.stringify(obj)));
      return arrayBuffer2String(result);
    }

    function string2ArrayBuffer(str: string): ArrayBuffer {
      const result = new ArrayBuffer(str.length * 2);
      const bufferView = new Uint16Array(result);
      for (let index = 0; index < str.length; index++) {
        bufferView[index] = str.charCodeAt(index);
      }
      return result;
    }

    function arrayBuffer2String(arrayBuffer: ArrayBuffer): string {
      return String.fromCharCode.apply(null, Array.from(new Uint16Array(arrayBuffer)));
    }
  }
}
