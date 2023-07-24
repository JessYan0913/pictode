import App from './app';

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export abstract class ToolStrategy {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  public abstract onMouseDown(event: MouseEvent): void;

  public abstract onMouseMove(event: MouseEvent): void;

  public abstract onMouseUp(event: MouseEvent): void;
}

export abstract class Service {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  public abstract dispose(): void;
}

export interface EventArgs {}

export interface ControlVisible {
  bl?: boolean;
  br?: boolean;
  mb?: boolean;
  ml?: boolean;
  mr?: boolean;
  mt?: boolean;
  tl?: boolean;
  tr?: boolean;
  mtr?: boolean;
}

export interface ControlsOption {
  hasControls?: boolean;
  padding?: number;
  borderColor?: string;
  cornerColor?: string;
  cornerStrokeColor?: string;
  cornerStyle?: 'rect' | 'circle';
  cornerSize?: number;
  rotatingPointOffset?: number;
  transparentCorners?: boolean;
  centeredScaling?: boolean;
  centeredRotation?: boolean;
  controlVisible?: ControlVisible;
}

export interface AppOption {
  backgroundColor?: string;
  controls?: ControlsOption | boolean;
}
