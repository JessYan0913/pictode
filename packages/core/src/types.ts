import App from './app';

export interface Plugin {
  name: string;
  install(context: App, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export interface EventArgs {}
