import { BaseService } from '@pictode/utils';
import { fabric } from 'fabric';

import { EventArgs, Plugin } from './types';

export class App extends BaseService<EventArgs> {
  public canvas: fabric.Canvas;

  private installedPlugins: Map<string, Plugin> = new Map();
  private canvasEl: HTMLCanvasElement;

  constructor() {
    super();
    this.canvasEl = document.createElement('canvas');
    this.canvas = new fabric.Canvas(null, {
      backgroundColor: 'lightgray',
      width: 500,
      height: 500,
    });
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

  public mount(element: HTMLElement) {
    element.appendChild(this.canvasEl);
    this.canvas.initialize(this.canvasEl);
    this.addRect();
  }

  public addRect() {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20,
      hasControls: true,
      hasBorders: true,
    });

    this.canvas?.add(rect);
  }
}

export default App;
