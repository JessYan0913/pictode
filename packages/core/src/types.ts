import Konva from 'konva';

import App from './app';
import { Point } from './utils';

export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>;
export type KonvaDragEvent = Konva.KonvaEventObject<DragEvent>;
export type KonvaNode = Konva.Group | Konva.Shape;

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  destroy(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export interface AppMouseEvent {
  event: KonvaMouseEvent;
  pointer: Point;
  app: App;
}

export interface Tool {
  name: string;
  onActive(app: App): Promise<void> | void;
  onInactive?: (app: App) => Promise<void> | void;
  onMousedown?: (event: AppMouseEvent) => void;
  onMousemove?: (event: AppMouseEvent) => void;
  onMouseup?: (event: AppMouseEvent) => void;
  onDoubleClick?: (event: AppMouseEvent) => void;
  onClick?: (event: AppMouseEvent) => void;
}

export abstract class Service {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  public abstract destroy(): void;
}

export interface EventArgs {
  'tool:changed': {
    oldTool: Tool | null;
    curTool: Tool;
  };
  'canvas:rendered': {
    time: number;
  };
  'selected:changed': {
    selected: KonvaNode[];
  };
  'node:added': {
    nodes: KonvaNode[];
  };
  'node:removed': {
    nodes: KonvaNode[];
  };
  'node:updated': {
    nodes: KonvaNode[];
  };
  'node:transform:start': {
    nodes: KonvaNode[];
  };
  'node:transform:end': {
    nodes: KonvaNode[];
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
