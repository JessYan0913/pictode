import { BaseService } from '@pictode/utils';
import { fabric } from 'fabric';

import { Rect } from './customs/rect';
import { AppOption, ControlsOption, EventArgs, Model, Plugin, ToolStrategy } from './types';
import { DEFAULT_APP_OPTION } from './utils';

export class App extends BaseService<EventArgs> {
  public canvas: fabric.Canvas;

  private currentTool: ToolStrategy | null = null;
  private option: AppOption & { controls: ControlsOption };
  private installedPlugins: Map<string, Plugin> = new Map();
  private canvasEl: HTMLCanvasElement;
  private curPointer: fabric.Point = new fabric.Point(0, 0);

  constructor(option?: AppOption) {
    super();
    this.option = Object.assign({}, DEFAULT_APP_OPTION, option ?? DEFAULT_APP_OPTION);
    this.canvasEl = document.createElement('canvas');
    this.canvas = new fabric.Canvas(null, {
      backgroundColor: option?.backgroundColor,
    });
    this.setControls(this.option.controls);
    this.canvas.on('mouse:move', ({ e }: fabric.IEvent<MouseEvent>) => {
      const { x, y } = this.canvas.getPointer(e);
      this.curPointer.setXY(x, y);
      console.log('===>', x, y);
    });
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.canvasEl);
    this.canvas.initialize(this.canvasEl, {
      width: element.clientWidth,
      height: element.clientHeight,
    });
    this.setModel('select');
  }

  public setControls(controls: ControlsOption | boolean): App {
    this.option.controls = controls;
    if (typeof controls === 'boolean') {
      this.option.controls.hasControls = controls;
    }

    Object.entries(this.option.controls).forEach(([key, value]) => {
      if (key === 'controlVisible') {
        fabric.Object.prototype.setControlsVisibility(value);
      } else {
        Reflect.set(fabric.Object.prototype, key, value);
      }
    });
    this.render(true);
    return this;
  }

  public setTool(tool: ToolStrategy): App {
    this.currentTool = tool;
    return this;
  }

  public setModel(model: Model): App {
    const rect = new Rect({
      width: 200,
      height: 100,
      top: 20,
      left: 20,
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 5,
      rx: 5,
      ry: 5,
    });
    switch (model) {
      case 'select':
        this.canvas.isDrawingMode = false;
        this.canvas.selection = true;
        this.canvas.selectionColor = 'rgba(157, 157, 231, 0.5)';
        this.canvas.selectionBorderColor = 'rgb(157, 157, 231)';
        this.canvas.selectionLineWidth = 2;
        break;
      case 'drawing':
        this.canvas.isDrawingMode = true;
        this.canvas.selection = false;
        this.canvas.freeDrawingBrush.color = 'red';
        this.canvas.freeDrawingBrush.width = 20;
        break;
      case 'rect':
        this.canvas.add(rect);
        break;
    }
    return this;
  }

  public render(asyncRedraw?: boolean): void {
    if (asyncRedraw) {
      this.canvas.requestRenderAll();
    } else {
      this.canvas.renderAll();
    }
  }

  public use(plugin: Plugin, ...options: any[]): App {
    if (!this.installedPlugins.has(plugin.name)) {
      this.installedPlugins.set(plugin.name, plugin);
      plugin.install(this, ...options);
    }
    return this;
  }

  public getPlugin<T extends Plugin>(pluginName: string): T | undefined {
    return this.installedPlugins.get(pluginName) as T;
  }

  public getPlugins<T extends Plugin[]>(pluginNames: string[]): T | undefined {
    return pluginNames.map((pluginName) => this.getPlugin(pluginName)) as T;
  }

  public enablePlugin(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.enable?.());
    return this;
  }

  public disablePlugin(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.disable?.());
    return this;
  }

  public isPluginEnable(pluginName: string): boolean {
    return this.getPlugin(pluginName)?.isEnabled?.() ?? false;
  }

  public disposePlugins(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.dispose());
    return this;
  }
}

export default App;
