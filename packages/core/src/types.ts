import Konva from 'konva';

import App from './app';

export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>;
export type KonvaDragEvent = Konva.KonvaEventObject<DragEvent>;
export type Shape = Konva.Shape;
export type ChildType = Konva.Group | Konva.Shape;

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}
export interface AppMouseEvent {
  event: KonvaMouseEvent;
  app: App;
}

export interface Tool {
  name: string;
  onActive(app: App): Promise<void> | void;
  onInactive?: (app: App) => Promise<void> | void;
  onMouseDown?: (event: AppMouseEvent) => void;
  onMouseMove?: (event: AppMouseEvent) => void;
  onMouseUp?: (event: AppMouseEvent) => void;
  onMouseDoubleClick?: (event: AppMouseEvent) => void;
  onMouseClick?: (event: AppMouseEvent) => void;
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
  'shape:added': {
    object: ChildType[];
  };
  'shape:removed': {
    object: ChildType[];
  };
  'shape:transform:start': {
    object: ChildType[];
  };
  'shape:transform:end': {
    object: ChildType[];
  };
  'mouse:down': {
    event: KonvaMouseEvent;
  };
  'mouse:up': {
    event: KonvaMouseEvent;
  };
  'mouse:move': {
    event: KonvaMouseEvent;
  };
  'mouse:click': {
    event: KonvaMouseEvent;
  };
  'mouse:dbclick': {
    event: KonvaMouseEvent;
  };
  'mouse:over': {
    event: KonvaMouseEvent;
  };
  'mouse:out': {
    event: KonvaMouseEvent;
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

export interface AppConfig {
  backgroundColor?: string;
}
