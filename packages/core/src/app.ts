import { BaseService } from '@pictode/utils';
import Konva from 'konva';

import './polyfill';

import { Mouse } from './services/mouse';
import { Selector } from './services/selector';
import { Tooler } from './services/tooler';
import { EventArgs, KonvaMouseEvent, KonvaNode, Plugin, Tool } from './types';
import { guid, Point } from './utils';

export class App extends BaseService<EventArgs> {
  public stage: Konva.Stage;
  public mainLayer: Konva.Layer;

  private mouse: Mouse;
  private selector: Selector;
  private tooler: Tooler;
  private containerElement: HTMLDivElement;
  private installedPlugins: Map<string, Plugin> = new Map();
  private resizeObserver: ResizeObserver;

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

    this.selector = new Selector(this);
    this.tooler = new Tooler(this);
    this.mouse = new Mouse(this);
    this.resizeObserver = new ResizeObserver(this.onContainerResize);
  }

  private onContainerResize = (e: ResizeObserverEntry[]) => {
    const { width, height } = e[0].contentRect;
    this.stage.width(width);
    this.stage.height(height);
    this.render();
  };

  public get pointer(): Point {
    const { x, y } = this.stage.getRelativePointerPosition() ?? { x: 0, y: 0 };
    return new Point(x, y);
  }

  public get selected(): KonvaNode[] {
    return [...this.selector.selected.values()];
  }

  public get curTool(): Tool | null {
    return this.tooler.currentTool;
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.containerElement);
    this.resizeObserver.observe(this.containerElement);
  }

  public async setTool(curTool: Tool): Promise<void> {
    await this.tooler.setTool(curTool);
  }

  public triggerToolAvailability(enable?: boolean): void {
    this.tooler.triggerAvailability(enable);
  }

  public add(...nodes: KonvaNode[]): void {
    this._add(...nodes);
    this.emit('node:added', { nodes: nodes });
  }

  public _add(...nodes: KonvaNode[]): void {
    this.mainLayer.add(
      ...nodes.map((node) => {
        if (!node.attrs.id) {
          node.id(`#${guid()}`);
        }
        return node;
      })
    );
    this.render();
  }

  public remove(...nodes: KonvaNode[]): void {
    this._remove(...nodes);
    this.emit('node:removed', { nodes: nodes });
  }

  public _remove(...nodes: KonvaNode[]): void {
    this.cancelSelect(...nodes);
    nodes.forEach((node) => {
      node.remove();
    });
    this.render();
  }

  public update(...nodes: KonvaNode[]): void {
    const getNodes = (nodes: KonvaNode[]): KonvaNode[] =>
      nodes.reduce((result, node) => {
        const originNode = this.getNodeById(node.attrs.id);
        if (originNode) {
          result.push(originNode);
        }
        return result;
      }, [] as KonvaNode[]);
    this.emit('node:update:before', { nodes: getNodes(nodes) });
    this._update(...nodes);
    this.emit('node:updated', { nodes: getNodes(nodes) });
  }

  public _update(...nodes: KonvaNode[]): void {
    nodes.forEach((node) => {
      const originNode = this.getNodeById(node.attrs.id);
      originNode?.setAttrs(node.attrs);
    });
    this.render();
  }

  public getNodeById(id: string): KonvaNode | undefined {
    return this.getNodes((node) => node.id() === id)?.[0];
  }

  public getNodes(selector: (node: KonvaNode) => boolean): KonvaNode[] {
    return this.mainLayer.find(selector) ?? [];
  }

  public triggerSelector(enable?: boolean): void {
    this.cancelSelect();
    this.selector.triggerSelector(enable);
  }

  public select(...nodes: KonvaNode[]): void {
    this.selector.select(...nodes);
  }

  public selectByEvent(event: KonvaMouseEvent): void {
    if (event.target instanceof Konva.Stage) {
      this.cancelSelect();
    } else {
      this.select(event.target);
    }
  }

  public cancelSelect(...nodes: KonvaNode[]): void {
    this.selector.cancelSelect(...nodes);
  }

  public isPointInArea(point: Point, area: { width: number; height: number; x: number; y: number }): boolean {
    const { width, height, x, y } = area;
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  }

  public getShapesInArea(shape: Konva.Shape): (Konva.Shape | Konva.Group)[] {
    return this.mainLayer.getChildren(
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
    // 判断r2的四个角点是否都在r1内部
    const topLeftContained = r1.x <= r2.x && r1.y <= r2.y;
    const topRightContained = r1.x + r1.width >= r2.x + r2.width && r1.y <= r2.y;
    const bottomLeftContained = r1.x <= r2.x && r1.y + r1.height >= r2.y + r2.height;
    const bottomRightContained = r1.x + r1.width >= r2.x + r2.width && r1.y + r1.height >= r2.y + r2.height;

    // 如果r2的四个角点都在r1内部，则认为r2完全包含在r1内部
    return topLeftContained && topRightContained && bottomLeftContained && bottomRightContained;
  }

  public render(): void {
    this.mainLayer.draw();
  }

  public scrollToContent(): void {
    //TODO: 需要实现滚动到内容功能
  }

  public clear(): void {
    this.mainLayer.removeChildren();
    this.selector.clear();
    this.render();
  }

  public toJSON(): string {
    return this.mainLayer.toJSON();
  }

  public fromJSON(json: string): void {
    const layer = Konva.Node.create(json, 'layer');
    this.mainLayer = layer;
    this.render();
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

  public destroyPlugins(plugins: string | string[]): App {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.destroy());
    return this;
  }

  public destroy(): void {
    this.resizeObserver.disconnect();
    this.destroyPlugins(Array.from(this.installedPlugins.keys()));
    this.mouse.destroy();
    this.selector.destroy();
    this.tooler.destroy();
    this.stage.destroy();
    this.removeAllListeners();
  }
}

export default App;
