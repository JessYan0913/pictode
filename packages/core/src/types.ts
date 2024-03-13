import Konva from 'konva';

import App from './app';
import { Point } from './utils';

export interface Modifier {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  exact: boolean;
}

export interface AppConfig {
  backgroundColor: string;
  panning: {
    enabled: boolean;
    cursor?: string;
  };
  scale: {
    min: number;
    max: number;
  };
  mousewheel: {
    enabled: boolean;
    factor: number;
  };
}

export type KonvaMouseEvent = Konva.KonvaEventObject<MouseEvent>;
export type KonvaWheelEvent = Konva.KonvaEventObject<WheelEvent>;
export type KonvaDragEvent = Konva.KonvaEventObject<DragEvent>;
export type KonvaNode = Konva.Group | Konva.Shape;

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  destroy(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
  resetLayer?(): void;
}

export interface ToolEvent {
  event: KonvaMouseEvent;
  pointer: Point;
  app: App;
}

export interface ToolHooks<T extends Tool = Tool> {
  onActive?: (app: App, tool: T) => void | Promise<void>;
  onInactive?: (app: App, tool: T) => void | Promise<void>;
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
  enableChanged?: (oldEnable: boolean, newEnable: boolean) => void;
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
    curTool: Tool | null;
  };
  'canvas:rendered': {
    time: number;
  };
  'canvas:cleared': {};
  'canvas:zoom:start': {
    scale: number;
  };
  'canvas:zoom:end': {
    scale: number;
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
  'node:group:make': {
    nodes: KonvaNode[];
    group: Konva.Group;
  };
  'node:group:decompose': {
    nodes: KonvaNode[];
    group: Konva.Group;
  };
  'node:transform:start': {
    nodes: KonvaNode[];
  };
  'node:transform:end': {
    nodes: KonvaNode[];
  };
  'node:zindex:changed': {
    nodes: {
      node: KonvaNode;
      oldZIndex: number;
      newZIndex: number;
    }[];
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
  'mouse:contextmenu': {
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
