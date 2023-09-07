import { App, EventArgs, Konva, KonvaNode, util } from '@pictode/core';

import { Options } from './types';

interface HightLightRect {
  rect: Konva.Rect;
  transformHandler: (...args: any) => any;
  dragHandler: (...args: any) => any;
}

export class Selector {
  public app: App;
  public selected: Map<number | string, KonvaNode>;
  public optionLayer: Konva.Layer;
  public enable: boolean;
  public multipleSelect: boolean;

  private transformer: Konva.Transformer;
  private rubberRect: Konva.Rect;
  private rubberStartPoint: util.Point = new util.Point(0, 0);
  private rubberEnable: boolean = false;
  private hightLightRects: Map<string, HightLightRect>;

  constructor(app: App, options?: Options) {
    const { enable = true, multipleSelect = false } = options ?? {};
    this.app = app;
    this.selected = new Map();
    this.hightLightRects = new Map();
    this.enable = enable;
    this.multipleSelect = multipleSelect;

    this.optionLayer = new Konva.Layer();
    this.optionLayer.name('pictode:option:layer');
    this.app.stage.add(this.optionLayer);

    this.transformer = new Konva.Transformer({
      padding: 5,
      ignoreStroke: true,
      borderStroke: 'rgb(157, 157, 231)',
      borderStrokeWidth: 1,
      borderDash: [3, 3],
      anchorSize: 8,
      anchorStroke: 'rgb(157, 157, 231)',
      anchorCornerRadius: 3,
      anchorStrokeWidth: 1,
      rotateAnchorOffset: 20,
    });
    this.transformer.anchorStyleFunc((anchor) => {
      if (
        ['middle-left', 'middle-right', 'top-center', 'bottom-center'].some((anchorName) =>
          anchor.hasName(anchorName)
        ) &&
        ([...this.selected.values()]?.[0] instanceof Konva.Text ||
          [...this.selected.values()]?.[0] instanceof Konva.Group ||
          this.selected.size > 1)
      ) {
        anchor.visible(false);
      }
      const setAnchorCursor = (cursor: string = '') => {
        const anchorStage = anchor.getStage();
        if (!anchorStage || !anchorStage.content) {
          return;
        }
        anchorStage.content.style.cursor = cursor;
      };
      anchor.on('mousedown', () => {
        this.enable = false;
      });
      anchor.on('mouseup', () => {
        this.enable = true;
      });
      anchor.on('mouseenter', () => {
        this.enable = false;
        if (!anchor.hasName('rotater')) {
          return;
        }
        setAnchorCursor('grabbing');
      });
      anchor.on('mouseout', () => {
        this.enable = true;
        if (!anchor.hasName('rotater')) {
          return;
        }
        setAnchorCursor();
      });
    });

    this.optionLayer.add(this.transformer);

    this.rubberRect = new Konva.Rect({
      stroke: 'rgb(157, 157, 231)',
      fill: 'rgba(157, 157, 231, 0.5)',
      strokeWidth: 2,
      strokeScaleEnabled: false,
    });
    this.optionLayer.add(this.rubberRect);

    this.transformer.on<'transformstart'>('transformstart', this.onTransformStart);
    this.transformer.on<'transformend'>('transformend', this.onTransformEnd);
    this.transformer.on<'dragstart'>('dragstart', this.onDragStart);
    this.transformer.on<'dragend'>('dragend', this.onDragEnd);

    this.app.on('mouse:down', this.onMouseDown);
    this.app.on('mouse:move', this.onMouseMove);
    this.app.on('mouse:up', this.onMouseUp);
    this.app.on('mouse:click', this.onMouseClick);
    this.app.on('mouse:out', this.onMouseOut);
  }

  public select(...nodes: KonvaNode[]): void {
    if (!this.enable) {
      return;
    }
    if (util.shapeArrayEqual(nodes, [...this.selected.values()])) {
      return;
    }
    this.cancelSelect();
    const handleNodeRemoved = (node: KonvaNode) => {
      this.cancelSelect(node);
      node.off('removed');
    };
    this.transformer.nodes(
      nodes.filter((node) => {
        node.draggable(true);
        this.selected.set(node.id(), node);
        node.on<'removed'>('removed', () => handleNodeRemoved(node));
        return node !== this.rubberRect;
      })
    );
    this.setHightRect(...nodes);
    this.app.render();
    this.app.emit('selected:changed', { selected: [...this.selected.values()] });
  }

  public cancelSelect(...nodes: KonvaNode[]): void {
    if (this.selected.size === 0) {
      return;
    }
    if (nodes.length === 0) {
      nodes = [...this.selected.values()];
    }
    nodes.forEach((node) => {
      node.draggable(false);
      this.selected.delete(node.id());
    });
    this.removeHightRect(...nodes);
    this.transformer.nodes([...this.selected.values()]);
    this.app.emit('selected:changed', { selected: [...this.selected.values()] });
  }

  public selectAll(): void {
    this.select(...this.app.mainLayer.getChildren());
  }

  public triggerSelector(enable?: boolean): void {
    if (enable === void 0) {
      this.enable = !this.enable;
    } else {
      this.enable = enable;
    }
    if (!this.enable) {
      this.rubberEnable = false;
    }
  }

  public isSelected(node: KonvaNode): boolean {
    return this.selected.has(node.id());
  }

  public getSelectClientRect(): {
    width: number;
    height: number;
    x: number;
    y: number;
  } {
    return this.transformer.getClientRect();
  }

  private setHightRect(...nodes: KonvaNode[]) {
    this.hightLightRects = nodes.reduce((hightRects, node) => {
      const rect = new Konva.Rect({
        stroke: 'rgb(157, 157, 231)',
        strokeWidth: 1,
        fillEnabled: false,
        strokeScaleEnabled: false,
      });
      this.calculateNodeRect(node, rect);
      this.optionLayer.add(rect);

      const dragHandler = () => this.calculateNodeRect(node, rect);
      const transformHandler = () => this.calculateNodeRect(node, rect);

      node.on('dragmove', dragHandler);
      node.on('transform', transformHandler);

      hightRects.set(node.id(), {
        rect,
        transformHandler,
        dragHandler,
      });
      return hightRects;
    }, new Map<string, HightLightRect>());
  }

  private removeHightRect(...nodes: KonvaNode[]) {
    nodes.forEach((node) => {
      const hightLight = this.hightLightRects.get(node.id());
      if (!hightLight) {
        return;
      }
      node.off('dragmove', hightLight.dragHandler);
      node.off('transform', hightLight.transformHandler);
      hightLight.rect.remove();
      this.hightLightRects.delete(node.id());
    });
  }

  private calculateNodeRect(node: KonvaNode, rect: Konva.Rect): void {
    const position = node.getAbsolutePosition();
    const size = {
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
    };
    const rotation = node.rotation();
    const canvasScaleX = this.app.stage.scaleX();
    const canvasScaleY = this.app.stage.scaleY();
    const canvasOffsetX = this.app.stage.x();
    const canvasOffsetY = this.app.stage.y();
    rect.position({
      x: (position.x - canvasOffsetX) / canvasScaleX,
      y: (position.y - canvasOffsetY) / canvasScaleY,
    });
    rect.width(size.width);
    rect.height(size.height);
    rect.rotation(rotation);
  }

  private onTransformStart = (): void => {
    this.app.emit('node:transform:start', { nodes: [...this.selected.values()] });
    this.app.emit('node:update:before', { nodes: [...this.selected.values()] });
  };

  private onTransformEnd = (): void => {
    this.app.emit('node:transform:end', { nodes: [...this.selected.values()] });
    this.app.emit('node:updated', { nodes: [...this.selected.values()] });
  };

  private onDragStart = (): void => {
    this.app.emit('node:transform:start', { nodes: [...this.selected.values()] });
    this.app.emit('node:update:before', { nodes: [...this.selected.values()] });
  };

  private onDragEnd = (): void => {
    this.app.emit('node:transform:end', { nodes: [...this.selected.values()] });
    this.app.emit('node:updated', { nodes: [...this.selected.values()] });
  };

  private onMouseDown = ({ event }: EventArgs['mouse:down']): void => {
    if (!this.enable || event.evt.button !== 0) {
      return;
    }
    if (event.target instanceof Konva.Stage) {
      this.cancelSelect();
      this.rubberStartPoint.clone(this.app.pointer);
      this.rubberRect.setPosition(this.rubberStartPoint);
      this.rubberRect.width(0);
      this.rubberRect.height(0);
      this.rubberRect.visible(false);
      this.rubberEnable = true;
    }
  };

  private onMouseMove = (): void => {
    if (!this.enable) {
      return;
    }
    // 判断鼠标坐标是否在transformer内，如果在光标为move，否则为默认
    const { x, y, width, height } = this.transformer.getClientRect();
    const inTransformer = util.pointInConvexPolygon(this.app.pointer, [
      new util.Point(x, y),
      new util.Point(x + width, y),
      new util.Point(x + width, y + height),
      new util.Point(x, y + height),
    ]);
    this.app.stage.container().style.cursor = inTransformer ? 'move' : 'default';
    if (!this.rubberEnable) {
      return;
    }
    // 如果弹性框选可用，则改变弹性框的尺寸
    const position = new util.Point(
      Math.min(this.app.pointer.x, this.rubberStartPoint.x),
      Math.min(this.app.pointer.y, this.rubberStartPoint.y)
    );
    this.rubberRect.setPosition(position);
    this.rubberRect.width(Math.max(this.app.pointer.x, this.rubberStartPoint.x) - position.x);
    this.rubberRect.height(Math.max(this.app.pointer.y, this.rubberStartPoint.y) - position.y);
    this.rubberRect.visible(true);
  };

  private onMouseUp = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.enable || event.evt.button !== 0) {
      return; // 未启用时直接返回
    }

    if (this.rubberEnable) {
      const shapesInRubberRect = this.app.getShapesInArea(this.rubberRect);
      this.select(...shapesInRubberRect);
      this.rubberRect.visible(false);
      this.rubberEnable = false;
      return; // 橡皮擦模式处理后直接返回
    }
  };

  private onMouseClick = ({ event }: EventArgs['mouse:click']): void => {
    if (!this.enable || event.evt.button !== 0) {
      return; // 未启用时直接返回
    }

    if (event.target instanceof Konva.Stage || !event.target.attrs.id) {
      return; // 如果是舞台或者没有ID属性，直接返回
    }

    // 如果同时按下了shift键则认为是多选模式
    if (event.evt.shiftKey && this.multipleSelect) {
      if (this.selected.has(event.target.attrs.id)) {
        this.cancelSelect(event.target);
      } else {
        this.select(...this.selected.values(), event.target);
      }
    } else {
      const topGroup = this.app.findTopGroup(event.target);
      if (topGroup) {
        this.select(topGroup);
      } else {
        this.select(event.target);
      }
    }
  };

  private onMouseOut = ({ event }: EventArgs['mouse:out']): void => {
    if (event.target instanceof Konva.Stage) {
      this.rubberEnable = false;
    }
  };

  public destroy(): void {
    this.transformer.off('transformstart', this.onTransformStart);
    this.transformer.off('transformend', this.onTransformEnd);
    this.transformer.off('dragstart', this.onDragStart);
    this.transformer.off('dragend', this.onDragEnd);
    this.app.off('mouse:down', this.onMouseDown);
    this.app.off('mouse:move', this.onMouseMove);
    this.app.off('mouse:up', this.onMouseUp);
    this.app.off('mouse:click', this.onMouseClick);
    this.app.off('mouse:out', this.onMouseOut);
    this.selected.clear();
    this.enable = false;
    this.transformer.remove();
    this.optionLayer.remove();
  }
}

export default Selector;
