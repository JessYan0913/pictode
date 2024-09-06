import { App, EventArgs, Konva, KonvaNode, util } from '@pictode/core';
import { EnabledCheck } from '@pictode/utils';

import { HightLightConfig, Options, RubberConfig, TransformerConfig } from './types';
import { getNodeRect, transformPoint } from './utils';

interface HightLightRect {
  rect: Konva.Rect;
  transformHandler: (...args: any) => any;
}

let TRANSFORM_CHANGE_STR = [
  'widthChange',
  'heightChange',
  'scaleXChange',
  'scaleYChange',
  'skewXChange',
  'skewYChange',
  'rotationChange',
  'offsetXChange',
  'offsetYChange',
  'transformsEnabledChange',
  'strokeWidthChange',
];

export class Selector {
  public app: App;
  public selected: Map<number | string, KonvaNode>;
  public enabled: boolean;
  public multipleSelect: boolean;
  public hightLightConfig: HightLightConfig;
  public transformerConfig: TransformerConfig;
  public rubberConfig: RubberConfig;

  private transformer: Konva.Transformer;
  private rubberRect: Konva.Rect;
  private rubberStartPoint: util.Point = new util.Point(0, 0);
  private rubberEnable: boolean = false;
  private hightLightRects: Map<string, HightLightRect>;
  private innerPortal: Konva.Group;

  constructor(app: App, options: Options) {
    const { enabled, multipleSelect, transformer, hightLight, rubber } = options;
    this.app = app;
    this.selected = new Map();
    this.hightLightRects = new Map();
    this.enabled = enabled;
    this.multipleSelect = multipleSelect;
    this.transformerConfig = transformer;
    this.hightLightConfig = hightLight;
    this.rubberConfig = rubber;

    this.innerPortal = new Konva.Group({ name: 'inner_portal' });
    this.app.optionLayer.add(this.innerPortal);

    this.transformer = new Konva.Transformer({
      name: 'pictode:transformer',
      ...this.transformerConfig,
      shouldOverdrawWholeArea: false, // 空白区域是否支持鼠标事件
      flipEnabled: false,
    });
    this.transformer.anchorStyleFunc((anchor) => {
      if (
        ['middle-left', 'middle-right', 'top-center', 'bottom-center'].some((anchorName) =>
          anchor.hasName(anchorName),
        ) &&
        ([...this.selected.values()]?.[0] instanceof Konva.Text ||
          [...this.selected.values()]?.[0] instanceof Konva.Group ||
          this.selected.size > 1)
      ) {
        anchor.visible(false);
      }
      const setAnchorCursor = (cursor: string = '') => {
        const anchorStage = anchor.getStage();
        if (!anchorStage?.content) {
          return;
        }
        anchorStage.content.style.cursor = cursor;
      };
      anchor.on('mousedown', () => {
        this.enabled = false;
      });
      anchor.on('mouseup mouseout', () => {
        this.enabled = true;
      });
      anchor.on('mouseenter', () => {
        this.enabled = false;
        if (anchor.hasName('rotater')) {
          setAnchorCursor('grabbing');
        } else if (anchor.hasName('point')) {
          setAnchorCursor('pointer');
        }
      });
    });

    this.app.optionLayer.add(this.transformer);

    this.rubberRect = new Konva.Rect({
      name: 'pictode:rubber:rect',
      stroke: this.rubberConfig.stroke,
      fill: this.rubberConfig.fill,
      strokeWidth: this.rubberConfig.strokeWidth,
      strokeScaleEnabled: false,
    });
    this.app.optionLayer.add(this.rubberRect);

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

  private handleNodeRemoved = ({ target }: any): void => {
    this.cancelSelect(target);
    target.off('removed', this.handleNodeRemoved);
  };

  @EnabledCheck
  public select(...nodes: KonvaNode[]): void {
    if (util.shapeArrayEqual(nodes, [...this.selected.values()])) {
      return;
    }
    this.cancelSelect();
    this.transformer.nodes(
      nodes.filter((node) => {
        node.draggable(true);
        node.on<'removed'>('removed', this.handleNodeRemoved);
        this.selected.set(node.id(), node);
        return node !== this.rubberRect;
      }),
    );
    this.setHightRect(...nodes);
    if (nodes.length === 1 && nodes[0].className === 'Line') {
      this.createLineAnchor(nodes[0] as Konva.Line);
    }
    this.app.render();
    this.app.emit('selected:changed', { selected: [...this.selected.values()] });
  }

  @EnabledCheck
  public cancelSelect(...nodes: KonvaNode[]): void {
    if (this.selected.size === 0) {
      return;
    }
    if (nodes.length === 0) {
      nodes = [...this.selected.values()];
    }
    nodes.forEach((node) => {
      node.draggable(false);
      node.off('removed', this.handleNodeRemoved);
      this.selected.delete(node.id());
      if (node.className === 'Line') {
        this.innerPortal.removeChildren();
      }
    });
    this.removeHightRect(...nodes);
    this.transformer.nodes([...this.selected.values()]);
    this.app.emit('selected:changed', { selected: [...this.selected.values()] });
  }

  @EnabledCheck
  public selectAll(): void {
    this.select(...this.app.mainLayer.getChildren());
  }

  public triggerSelector(enable?: boolean): void {
    if (enable === void 0) {
      this.enabled = !this.enabled;
    } else {
      this.enabled = enable;
    }
    if (!this.enabled) {
      this.rubberEnable = false;
    }
  }

  @EnabledCheck
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

  private createLineAnchor(line: Konva.Line) {
    const points = line.points(); // 获取线条的所有点
    const lineTransform = line.getAbsoluteTransform();
    const portalTransform = this.innerPortal.getAbsoluteTransform();

    // 创建锚点函数
    const createAnchor = (index: number) => {
      const { x, y } = transformPoint(new util.Point(points[index], points[index + 1]), lineTransform, portalTransform);

      const anchor = new Konva.Rect({
        stroke: 'rgb(0, 161, 255)',
        fill: 'white',
        strokeWidth: 1,
        name: `${index}_anchor`,
        dragDistance: 0,
        draggable: true,
        hitStrokeWidth: 10,
        x,
        y,
        width: 10,
        height: 10,
        offsetX: 5,
        offsetY: 5,
      });

      this.innerPortal.add(anchor);
      addDragMoveEvent(anchor, index, points, line);
    };

    // 处理拖动事件
    const addDragMoveEvent = (anchor: Konva.Rect, index: number, points: number[], line: Konva.Line) => {
      anchor.on('dragmove', ({ target }) => {
        const pos = target.getPosition();
        const { x, y } = transformPoint(
          new util.Point(pos.x, pos.y),
          this.innerPortal.getAbsoluteTransform(),
          line.getAbsoluteTransform(),
        );

        points[index] = x;
        points[index + 1] = y;
        line.points(points);
      });
    };

    // 创建所有锚点
    for (let index = 0; index < points.length; index += 2) {
      createAnchor(index);
    }

    // 更新所有锚点位置
    const updateAnchors = () => {
      const lineTransform = line.getAbsoluteTransform().copy();
      const portalTransform = this.innerPortal.getAbsoluteTransform().copy().invert();

      this.innerPortal.children?.forEach((anchor) => {
        const index = parseInt(anchor.name().split('_')[0], 10);
        if (!isNaN(index) && index < points.length) {
          const { x, y } = transformPoint(
            new util.Point(points[index], points[index + 1]),
            lineTransform,
            portalTransform,
          );
          anchor.position({ x, y });
        }
      });
    };

    line.on('transform dragmove', updateAnchors);
  }

  private setHightRect(...nodes: KonvaNode[]) {
    this.hightLightRects = nodes.reduce((hightRects, node) => {
      const rect = new Konva.Rect({
        name: `pictode:${node._id}:height:rect`,
        stroke: this.hightLightConfig.stroke,
        strokeWidth: this.hightLightConfig.strokeWidth,
        dash: this.hightLightConfig.dash,
        fillEnabled: false,
        strokeScaleEnabled: false,
      });
      this.getAbsoluteNodeRect(node, rect, this.hightLightConfig.padding ?? 0);
      this.app.optionLayer.add(rect);

      const transformHandler = () =>
        requestAnimationFrame(() => this.getAbsoluteNodeRect(node, rect, this.hightLightConfig.padding ?? 0));

      node.on('absoluteTransformChange', transformHandler);

      node.on(TRANSFORM_CHANGE_STR.join(' '), transformHandler);

      hightRects.set(node.id(), {
        rect,
        transformHandler,
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
      node.off('absoluteTransformChange', hightLight.transformHandler);
      node.off(TRANSFORM_CHANGE_STR.join(' '), hightLight.transformHandler);
      hightLight.rect.remove();
      this.hightLightRects.delete(node.id());
    });
  }

  private getAbsoluteNodeRect(node: KonvaNode, rect: Konva.Rect, padding: number = 0): void {
    const { x, y, width, height } = getNodeRect(node, padding);
    rect.position({
      x: (x - this.app.stage.x()) / this.app.stage.scaleX(),
      y: (y - this.app.stage.y()) / this.app.stage.scaleY(),
    });
    rect.width(width / this.app.stage.scaleX());
    rect.height(height / this.app.stage.scaleY());
    rect.rotation(node.rotation());
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
    if (!this.enabled || event.evt.button !== 0) {
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
    // TODO: 操作形变后，this.enable会变成false，但不知道为啥？？？
    if (!this.enabled) {
      return;
    }
    if (!this.rubberEnable) {
      return;
    }
    // 如果弹性框选可用，则改变弹性框的尺寸
    const position = new util.Point(
      Math.min(this.app.pointer.x, this.rubberStartPoint.x),
      Math.min(this.app.pointer.y, this.rubberStartPoint.y),
    );
    this.rubberRect.setPosition(position);
    this.rubberRect.width(Math.max(this.app.pointer.x, this.rubberStartPoint.x) - position.x);
    this.rubberRect.height(Math.max(this.app.pointer.y, this.rubberStartPoint.y) - position.y);
    this.rubberRect.visible(true);
  };

  private onMouseUp = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.enabled || event.evt.button !== 0) {
      return; // 未启用时直接返回
    }

    if (this.rubberEnable) {
      const shapesInRubberRect = this.app.getShapesInArea(this.rubberRect);
      this.select(...shapesInRubberRect);
      this.rubberRect.visible(false);
      this.rubberEnable = false;
    }
  };

  private onMouseClick = ({ event }: EventArgs['mouse:click']): void => {
    if (!this.enabled || event.evt.button !== 0) {
      return; // 未启用时直接返回
    }

    if (event.target instanceof Konva.Stage || !event.target.attrs.id) {
      return; // 如果是舞台或者没有ID属性，直接返回
    }

    const topGroup = this.app.findTopGroup(event.target);
    const target = topGroup ?? event.target;
    // 如果同时按下了shift键则认为是多选模式
    if (event.evt.shiftKey && this.multipleSelect) {
      if (this.selected.has(target.attrs.id)) {
        this.cancelSelect(target);
      } else {
        this.select(...this.selected.values(), target);
      }
    } else {
      this.select(target);
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
    this.enabled = false;
    this.transformer.remove();
    this.rubberRect.remove();
    this.innerPortal.remove();
  }
}

export default Selector;
