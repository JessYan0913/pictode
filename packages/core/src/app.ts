import { BaseService } from '@pictode/utils';
import Konva from 'konva';

import { MouseService } from './services/mouse';
import { ChildType, EventArgs, Plugin, Tool } from './types';

export class App extends BaseService<EventArgs> {
  public stage: Konva.Stage;
  public currentTool: Tool | null = null;
  public mainLayer: Konva.Layer;

  private mouse: MouseService;
  private containerElement: HTMLDivElement;
  private installedPlugins: Map<string, Plugin> = new Map();

  constructor() {
    super();
    this.containerElement = document.createElement('div');
    this.containerElement.setAttribute(
      'style',
      `
      width: 100%;
      height: 100%;
    `
    );
    this.stage = new Konva.Stage({
      container: this.containerElement,
      width: 500,
      height: 500,
    });
    this.mainLayer = new Konva.Layer();
    this.mainLayer.name('pictode:main:layer');
    this.stage.add(this.mainLayer);

    this.mouse = new MouseService(this);
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.containerElement);
    this.stage.setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    });

    this.mouse = new MouseService(this);
  }

  public setTool(tool: Tool): void {
    console.log('===>', tool);
  }

  public add(...children: ChildType[]): void {
    this.mainLayer.add(...children);
  }

  public render(): void {
    this.mainLayer.draw();
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

  public dispose(): void {
    this.currentTool = null;
    this.disposePlugins(Array.from(this.installedPlugins.keys()));
    // this.canvas.dispose();
    this.removeAllListeners();
  }
}

export default App;
