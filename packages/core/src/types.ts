import Context from './context';

export interface Plugin {
  name: string;
  install(context: Context, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export namespace Event {
  export interface ContextArgs {}
}
