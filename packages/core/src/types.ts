import { TPointerEvent, TPointerEventInfo } from 'fabric';

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
  event: TPointerEventInfo<TPointerEvent>;
  app: App;
}

export interface Tool {
  name: string;
  drawable: boolean;
  onMouseDown?: (event: AppMouseEvent) => void;
  onMouseMove?: (event: AppMouseEvent) => void;
  onMouseUp?: (event: AppMouseEvent) => void;
  onMouseDoubleClick?: (event: AppMouseEvent) => void;
  onMouseOver?: (event: AppMouseEvent) => void;
  onMouseOut?: (event: AppMouseEvent) => void;
}

export abstract class Service {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  public abstract dispose(): void;
}

export interface EventArgs {
  'tool:changed': {
    oldTool: Tool | null;
    curTool: Tool;
  };
  'canvas:rendered': {
    time: number;
  };
}

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

export interface ObjectConfig {
  objectCaching?: boolean;
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

export interface CanvasConfig {
  isDrawingMode?: boolean;
  selection?: boolean;
  selectionColor?: string;
  selectionBorderColor?: string;
  selectionLineWidth?: number;
}

export interface AppOption {
  backgroundColor?: string;
  canvasConfig?: CanvasConfig | boolean;
  objectConfig?: ObjectConfig | boolean;
}
