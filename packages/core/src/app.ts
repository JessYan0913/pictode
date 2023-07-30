import { BaseService } from '@pictode/utils';
import Konva from 'konva';

import { MouseService } from './services/mouse';
import { ChildType, EventArgs, Plugin, Tool } from './types';
import { Point } from './utils';

export class App extends BaseService<EventArgs> {
  public stage: Konva.Stage;
  public currentTool: Tool | null = null;
  public mainLayer: Konva.Layer;
  public selected: ChildType[] = [];

  private selector: Konva.Transformer;
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
    this.stage.container().style.backgroundColor = '#fff';
    this.mainLayer = new Konva.Layer();
    this.mainLayer.name('pictode:main:layer');
    this.stage.add(this.mainLayer);

    this.selector = new Konva.Transformer({
      padding: 3,
      borderStroke: 'rgb(157, 157, 231)',
      borderStrokeWidth: 1,
      anchorSize: 8,
      anchorStroke: 'rgb(157, 157, 231)',
      anchorCornerRadius: 3,
      anchorStrokeWidth: 1,
      rotateAnchorOffset: 20,
    });
    this.selector.anchorStyleFunc((anchor) => {
      if (!anchor.hasName('rotater')) {
        return;
      }
      const setAnchorCursor = (cursor: string = '') => {
        const anchorStage = anchor.getStage();
        if (!anchorStage || !anchorStage.content) {
          return;
        }
        anchorStage.content.style.cursor = cursor;
      };
      anchor.on('mouseenter', () => {
        setAnchorCursor('grab');
      });
      anchor.on('mouseout', () => {
        setAnchorCursor();
      });
    });
    this.mainLayer.add(this.selector);

    this.mouse = new MouseService(this);
  }

  public get pointer(): Point {
    const { x, y } = this.stage.getRelativePointerPosition() ?? { x: 0, y: 0 };
    return new Point(x, y);
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.containerElement);
    this.stage.setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    });

    this.mouse = new MouseService(this);
  }

  public setTool(curTool: Tool): void {
    const oldTool = this.currentTool;
    if (oldTool) {
      oldTool.onInactive(this);
    }
    this.currentTool = curTool;
    this.currentTool.onActive(this);
    this.render();
    this.emit('tool:changed', { oldTool, curTool });
  }

  public add(...children: ChildType[]): void {
    this.mainLayer.add(...children);
    this.render();
  }

  public select(...children: ChildType[]): void {
    this.selected.forEach((child) => child.draggable(false));
    this.selector.nodes([]);
    this.selected = children.map((child) => {
      child.draggable(true);
      return child;
    });
    this.selector.nodes(children);
  }

  public async getShapesInArea(shape: Konva.Shape): Promise<(Konva.Shape | Konva.Group)[]> {
    return await this.mainLayer.getChildren(
      (node) => node instanceof Konva.Shape && node.visible() && node !== shape && this.haveIntersection(shape, node)
    );
  }

  public haveIntersection(shape1: Konva.Shape, shape2: Konva.Shape): boolean {
    /** getClientRect()方法用于获取图形的边界矩形（bounding rectangle）。
     * 假设你有一个Konva.js的舞台（stage）和多个图形（shapes），这些图形有可能被嵌套在不同的容器中，
     * 而容器又被嵌套在其他容器中。如果你想获取某个图形相对于舞台的边界矩形，直接使用shape.getClientRect()将会得到相对于该图形自身的边界矩形。
     * 而这并不能满足你对整个舞台上图形相对位置的需求。
     * 但是，通过设置relativeTo: stage参数，shape.getClientRect({relativeTo: stage})将会返回该图形相对于舞台的边界矩形，
     * 这样你就能够正确获取图形在整个舞台上的相对位置和尺寸信息。
     * 这对于一些场景很重要，例如碰撞检测、相交检测、拖放功能等。
     * 使用relativeTo参数，可以在复杂的图形结构中正确地定位图形，并在需要时进行适当的计算。这样就可以更灵活和准确地处理图形之间的交互。
     *
     */
    const r1 = shape1.getClientRect({ relativeTo: this.stage });
    const r2 = shape2.getClientRect({ relativeTo: this.stage });

    return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
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
