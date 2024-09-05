import { BaseService } from '@pictode/utils';
import Konva from 'konva';

import './polyfill';

import { Mouse } from './services/mouse';
import { Tooler } from './services/tooler';
import { AppConfig, EventArgs, KonvaNode, Plugin, Tool } from './types';
import { DEFAULT_APP_CONFIG, getBackgroundImage, guid, Point } from './utils';

export class App extends BaseService<EventArgs> {
  public stage: Konva.Stage;
  public backgroundLayer: Konva.Layer;
  public mainLayer: Konva.Layer;
  public optionLayer: Konva.Layer;
  public background: Konva.Rect;
  public config: AppConfig;

  private mouse: Mouse;
  private tooler: Tooler;
  private installedPlugins: Map<string, Plugin> = new Map();
  private resizeObserver: ResizeObserver;

  constructor(config?: Partial<AppConfig>) {
    super();
    this.config = { ...DEFAULT_APP_CONFIG, ...config };

    this.stage = new Konva.Stage({
      container: document.createElement('div'),
      width: 500,
      height: 500,
    });
    this.stage.container().style.backgroundColor = '#fff';
    this.backgroundLayer = new Konva.Layer({
      name: 'pictode:background:layer',
    });
    this.background = new Konva.Rect({
      name: 'pictode:background:rect',
      x: this.stage.x(),
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      listening: false,
      opacity: 0.2,
    });
    this.backgroundLayer.add(this.background);
    this.mainLayer = new Konva.Layer({
      name: 'pictode:main:layer',
    });
    this.optionLayer = new Konva.Layer({
      name: 'pictode:option:layer',
    });
    this.stage.add(this.backgroundLayer, this.mainLayer, this.optionLayer);

    this.background.fillPatternImage(getBackgroundImage(this.config.background));
    this.triggerBackground(this.config.background.enabled);

    this.tooler = new Tooler(this);
    this.mouse = new Mouse(this);
    this.resizeObserver = new ResizeObserver(this.onContainerResize);
    this.triggerPanning(this.config.panning.enabled);
    this.triggerMouseWheel(this.config.mousewheel.enabled);

    this.on('canvas:resized', this.updateBackground);
    this.on('canvas:drag:move', this.updateBackground);
    this.on('canvas:zoom:end', this.updateBackground);
  }

  private updateBackground = (): void => {
    // ensure background rect is in the top-left of the canvas
    this.background.absolutePosition({ x: 0, y: 0 });

    // set the dimensions of the background rect to match the canvas - not the stage!!!
    this.background.size({
      width: this.stage.width() / this.stage.scaleX(),
      height: this.stage.height() / this.stage.scaleY(),
    });

    // Apply that movement to the fill pattern
    this.background.fillPatternOffset({
      x: -this.stage.x() / this.stage.scaleX(),
      y: -this.stage.y() / this.stage.scaleY(),
    });
  };

  private onContainerResize = (e: ResizeObserverEntry[]) => {
    const { width, height } = e[0].contentRect;
    this.stage.width(width);
    this.stage.height(height);
    this.render();
    this.emit('canvas:resized', { width, height });
  };

  public get pointer(): Point {
    const { x, y } = this.stage.getRelativePointerPosition() ?? { x: 0, y: 0 };
    return new Point(x, y);
  }

  public get curTool(): Tool | null {
    return this.tooler.currentTool;
  }

  public get containerElement(): HTMLDivElement {
    return this.stage.container();
  }

  public mount(element: HTMLDivElement) {
    this.stage.container(element);
    this.resizeObserver.observe(this.stage.container());
  }

  public async setTool(curTool: Tool | null): Promise<void> {
    await this.tooler.setTool(curTool);
  }

  public triggerPanning(enabled?: boolean): this {
    if (enabled === void 0) {
      this.stage.draggable(this.stage.draggable());
    } else {
      this.stage.draggable(enabled);
    }
    if (this.stage.draggable()) {
      this.stage.container().style.cursor = this.config.panning.cursor ?? 'grabbing';
    } else {
      this.stage.container().style.cursor = 'default';
    }
    return this;
  }

  public triggerMouseWheel(enabled?: boolean): this {
    if (enabled === void 0) {
      this.config.mousewheel.enabled = !this.config.mousewheel.enabled;
    } else {
      this.config.mousewheel.enabled = enabled;
    }
    return this;
  }

  public triggerTool(enabled?: boolean): this {
    this.tooler.trigger(enabled);
    this.updateBackground();
    return this;
  }

  public triggerBackground(visible?: boolean): this {
    this.background.visible(visible || !this.background.visible());
    return this;
  }

  public add(...nodes: Array<KonvaNode>): this {
    this._add(...nodes);
    this.emit('node:added', { nodes: nodes });
    return this;
  }

  public _add(...nodes: Array<KonvaNode>): this {
    this.mainLayer.add(
      ...nodes.map((node) => {
        if (!node.attrs.id) {
          node.id(`#${guid()}`);
        }
        return node;
      }),
    );
    this.render();
    return this;
  }

  public remove(...nodes: Array<KonvaNode>): this {
    this._remove(...nodes);
    this.emit('node:removed', { nodes: nodes });
    return this;
  }

  public _remove(...nodes: Array<KonvaNode>): this {
    nodes.forEach((node) => {
      node.remove();
    });
    this.render();
    return this;
  }

  public update(...nodes: Array<KonvaNode>): this {
    const getNodes = (nodes: Array<KonvaNode>): KonvaNode[] =>
      nodes.reduce<Array<KonvaNode>>((result, node) => {
        const originNode = this.getNodeById(node.attrs.id);
        if (originNode) {
          result.push(originNode);
        }
        return result;
      }, []);
    this.emit('node:update:before', { nodes: getNodes(nodes) });
    this._update(...nodes);
    this.emit('node:updated', { nodes: getNodes(nodes) });
    return this;
  }

  public _update(...nodes: Array<KonvaNode>): this {
    nodes.forEach((node) => {
      const originNode = this.getNodeById(node.attrs.id);
      originNode?.setAttrs(node.attrs);
    });
    this.render();
    return this;
  }

  public makeGroup(nodes: Array<KonvaNode>): Konva.Group {
    const resolve = this._makeGroup(nodes);
    if (resolve instanceof Konva.Group) {
      this.emit('node:group:make', {
        group: resolve,
        nodes,
      });
    }
    return resolve;
  }

  public _makeGroup(nodes: Array<KonvaNode>): Konva.Group {
    if (nodes.length < 2) {
      throw new Error(`A group can only be created if there are more than two graphics.`);
    }
    const group = new Konva.Group({ draggable: true });
    group.add(
      ...nodes.map((node) => {
        node.draggable(false);
        return node;
      }),
    );
    this._add(group);
    return group;
  }

  public decomposeGroup(group: Konva.Group): KonvaNode[] {
    const resolve = this._decomposeGroup(group);
    this.emit('node:group:decompose', {
      group,
      nodes: resolve,
    });
    return resolve;
  }

  public _decomposeGroup(group: Konva.Group): KonvaNode[] {
    const parent = group.getParent() ?? this.mainLayer;
    const resolve = [...group.getChildren()].map((child) => {
      const { x, y, scaleX, scaleY, rotation } = child.getAbsoluteTransform(parent).copy().decompose();
      child.moveTo(parent);
      child.position({ x, y });
      child.scale({ x: scaleX, y: scaleY });
      child.rotation(rotation);
      return child;
    });
    this._remove(group);
    return resolve;
  }

  public findTopGroup(target: Konva.Node): Konva.Group | null {
    if (target.parent instanceof Konva.Group && target.parent.parent instanceof Konva.Group) {
      // 继续向上查找最顶层的组
      return this.findTopGroup(target.parent);
    }
    // 如果已经不再有父组，返回当前目标
    return target.parent instanceof Konva.Group ? target.parent : null;
  }

  public moveUp(...nodes: Array<KonvaNode>): this {
    this.moveZIndexNodes(nodes, (node) => node.moveUp());
    return this;
  }

  public moveDown(...nodes: Array<KonvaNode>): this {
    this.moveZIndexNodes(nodes, (node) => node.moveDown());
    return this;
  }

  public moveTop(...nodes: Array<KonvaNode>): this {
    this.moveZIndexNodes(nodes, (node) => node.moveToTop());
    return this;
  }

  public moveBottom(...nodes: Array<KonvaNode>): this {
    nodes.forEach((node) => node.moveToBottom());
    this.moveZIndexNodes(nodes, (node) => node.moveToBottom());
    return this;
  }

  private moveZIndexNodes(nodes: Array<KonvaNode>, handler: (node: KonvaNode) => void): void {
    const eventPayload = nodes.map((node) => {
      const result = {
        node,
        oldZIndex: node.getZIndex(),
        newZIndex: node.getZIndex(),
      };
      handler(node);
      result.newZIndex = node.getZIndex();
      return result;
    });
    if (eventPayload.some(({ oldZIndex, newZIndex }) => oldZIndex !== newZIndex)) {
      this.emit('node:zindex:changed', { nodes: eventPayload });
    }
  }

  public getNodeById(id: string): KonvaNode | undefined {
    return this.getNodes((node) => node.id() === id)?.[0];
  }

  public getNodes(callback: (node: KonvaNode) => boolean): KonvaNode[] {
    return this.mainLayer.find(callback) ?? [];
  }

  public isPointInArea(point: Point, area: { width: number; height: number; x: number; y: number }): boolean {
    const { width, height, x, y } = area;
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  }

  public getShapesInArea(shape: Konva.Shape): KonvaNode[] {
    return this.mainLayer.getChildren(
      (node) => node.visible() && node !== shape && this.haveIntersection(shape, node as Konva.Shape),
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
    this.optionLayer.draw();
  }

  public scale(): number {
    return this.stage.scaleX();
  }

  public scaleTo(scale: number, pointer: Point = new Point(this.stage.width() / 2, this.stage.height() / 2)): this {
    const oldScale = this.scale();
    this.emit('canvas:zoom:start', { scale: oldScale });
    const newScale = Math.min(Math.max(scale, this.config.scale.min), this.config.scale.max);
    const mousePointTo = new Point((pointer.x - this.stage.x()) / oldScale, (pointer.y - this.stage.y()) / oldScale);
    this.stage.scale({ x: newScale, y: newScale });
    this.stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
    this.emit('canvas:zoom:end', { scale: this.scale() });
    return this;
  }

  public clear(): void {
    this.mainLayer.removeChildren();
    this.emit('canvas:cleared', {});
    this.render();
  }

  public async toDataURL(
    nodes?: Array<KonvaNode>,
    config?: {
      padding?: number;
      pixelRatio?: number;
      mimeType?: string;
      quality?: number;
      haveBackground?: boolean;
    },
  ): Promise<{ dataURL: string; width: number; height: number }> {
    const { padding = 10, pixelRatio = 2, mimeType = 'image/png', quality = 1, haveBackground = false } = config ?? {};

    const exportLayer = new Konva.Layer();

    this.stage.add(exportLayer);

    let objects = [];
    if (nodes && nodes.length > 0) {
      objects = nodes.map((object) => object.toObject());
    } else {
      objects = this.mainLayer.children?.map((object) => object.toObject()) ?? [];
    }

    const newNodes = objects.map((object) => Konva.Node.create(object));
    exportLayer.add(...newNodes);

    const transformer = new Konva.Transformer({ rotateAnchorOffset: 0 });
    transformer.nodes(newNodes);

    const clientRect = transformer.getClientRect();
    const canvasScaleX = this.stage.scaleX();
    const canvasScaleY = this.stage.scaleY();
    const canvasOffsetX = this.stage.x();
    const canvasOffsetY = this.stage.y();
    const width = clientRect.width + padding * 2;
    const height = clientRect.height + padding * 2;
    const x = clientRect.x - padding;
    const y = clientRect.y - padding;

    const background = new Konva.Rect({
      width,
      height,
      x: (x - canvasOffsetX) / canvasScaleX,
      y: (y - canvasOffsetY) / canvasScaleY,
      fill: this.stage.container().style.backgroundColor,
    });

    if (haveBackground) {
      exportLayer.add(background);
      background.moveToBottom();
    }
    return new Promise((resolve, reject) => {
      try {
        exportLayer.toDataURL({
          width,
          height,
          x,
          y,
          pixelRatio,
          mimeType,
          quality,
          callback: (str) => {
            resolve({
              dataURL: str,
              width,
              height,
            });
            transformer.remove();
            exportLayer.remove();
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public toJSON(): string {
    const result = this?.mainLayer?.toObject() || {};
    result.children?.forEach((child: KonvaNode) => {
      if (child.className === 'Image') {
        child.attrs.image = child?.attrs?.image?.currentSrc;
      }
    });
    return JSON.stringify(result);
  }

  public fromJSON(json: string): this {
    const data = JSON.parse(json);
    data.children.forEach((child: KonvaNode) => {
      if (child.className === 'Image') {
        const image = new Image();
        image.src = child?.attrs?.image;
        child.attrs.image = image;
      }
    });

    this.clear();
    this.mainLayer.remove();
    const layer = Konva.Node.create(data, 'layer');
    this.mainLayer = layer;
    this.stage.add(this.mainLayer);
    this.mainLayer.moveToBottom();
    this.backgroundLayer.moveToBottom();
    this.render();
    return this;
  }

  public use(plugin: Plugin, ...options: any[]): this {
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

  public enablePlugin(plugins: string | string[]): this {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.enable?.());
    return this;
  }

  public disablePlugin(plugins: string | string[]): this {
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

  public destroyPlugins(plugins: string | string[]): this {
    if (!Array.isArray(plugins)) {
      plugins = [plugins];
    }
    const aboutToChangePlugins = this.getPlugins(plugins);
    aboutToChangePlugins?.forEach((plugin) => plugin?.destroy());
    return this;
  }

  public destroy(): void {
    this.off('canvas:resized', this.updateBackground);
    this.off('canvas:drag:move', this.updateBackground);
    this.off('canvas:zoom:end', this.updateBackground);
    this.resizeObserver.disconnect();
    this.destroyPlugins(Array.from(this.installedPlugins.keys()));
    this.mouse.destroy();
    this.tooler.destroy();
    this.stage.destroy();
    this.removeAllListeners();
  }
}

export default App;
