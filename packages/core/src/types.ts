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

export interface ToolEvent {
  event: KonvaMouseEvent;
  pointer: Point;
  app: App;
}

export interface ToolHooks {
  onActive?: (app: App, tool: Tool) => void | Promise<void>;
  onInactive?: (app: App, tool: Tool) => void | Promise<void>;
  onStartDrawing?: (app: App, node: KonvaNode) => void;
  onCompleteDrawing?: (app: App, node: KonvaNode) => void;
}

export interface Tool<T extends Konva.ShapeConfig = Konva.ShapeConfig> {
  name: string;
  config?: T;
  hooks?: ToolHooks;
  mousedown?: (event: ToolEvent) => void;
  mousemove?: (event: ToolEvent) => void;
  mouseup?: (event: ToolEvent) => void;
  doubleClick?: (event: ToolEvent) => void;
  click?: (event: ToolEvent) => void;
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
  'node:update:before': {
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
