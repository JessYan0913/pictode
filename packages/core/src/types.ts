import { fabric } from 'fabric';

import App from './app';

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export interface AppMouseEvent {
  event: fabric.IEvent<MouseEvent>;
  app: App;
}

export interface ToolStrategy {
  onMouseDown(event: AppMouseEvent): void;
  onMouseMove(event: AppMouseEvent): void;
  onMouseUp(event: AppMouseEvent): void;
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
