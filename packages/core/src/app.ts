import { BaseService } from '@pictode/utils';
import { fabric } from 'fabric';

import { MouseService } from './services/mouse';
import { AppOption, ControlsOption, EventArgs, Plugin, ToolStrategy } from './types';
import { DEFAULT_APP_OPTION } from './utils';

export class App extends BaseService<EventArgs> {
  public canvas: fabric.Canvas;
  public mouseService: MouseService;
  public currentTool: ToolStrategy | null = null;

  private option: AppOption & { controls: ControlsOption };
  private installedPlugins: Map<string, Plugin> = new Map();
  private canvasEl: HTMLCanvasElement;

  constructor(option?: AppOption) {
    super();
    this.option = Object.assign({}, DEFAULT_APP_OPTION, option ?? DEFAULT_APP_OPTION);
    this.canvasEl = document.createElement('canvas');
    this.canvas = new fabric.Canvas(null, {
      backgroundColor: option?.backgroundColor,
    });
    // 关闭对象缓存，缩放时不会模糊
    fabric.Object.prototype.objectCaching = false;
    this.setControls(this.option.controls);
    this.mouseService = new MouseService(this);
  }

  public get pointer(): fabric.Point {
    return this.mouseService.pointer;
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.canvasEl);
    this.canvas.initialize(this.canvasEl, {
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }

  public setControls(controls: ControlsOption | boolean): void {
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
  }

  public setTool(tool: ToolStrategy): void {
    this.currentTool = tool;
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
