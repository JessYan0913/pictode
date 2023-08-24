import Konva from 'konva';

import { App } from '../app';
import { EventArgs, KonvaNode, Service } from '../types';
import { Point, pointInConvexPolygon, shapeArrayEqual } from '../utils';

export class Selector extends Service {
  public selected: Map<number | string, KonvaNode>;
  public optionLayer: Konva.Layer;
  public enable: boolean = false;
  public multipleEnable: boolean = false;

  private transformer: Konva.Transformer;
  private rubberRect: Konva.Rect;
  private rubberStartPoint: Point = new Point(0, 0);
  private rubberEnable: boolean = false;

  constructor(app: App) {
    super(app);
    this.selected = new Map();
    this.optionLayer = new Konva.Layer();
    this.optionLayer.name('pictode:option:layer');
    this.app.stage.add(this.optionLayer);

    this.transformer = new Konva.Transformer({
      padding: 3,
      ignoreStroke: true,
      borderStroke: 'rgb(157, 157, 231)',
      borderStrokeWidth: 1,
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
        ([...this.selected.values()]?.[0] instanceof Konva.Text || this.selected.size > 1)
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
        setAnchorCursor('grab');
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
    });
    this.optionLayer.add(this.rubberRect);

    this.transformer.on<'transformstart'>('transformstart', this.onTransformStart);
    this.transformer.on<'transformend'>('transformend', this.onTransformEnd);
    this.transformer.on<'dragstart'>('dragstart', this.onDragStart);
    this.transformer.on<'dragend'>('dragend', this.onDragEnd);

    this.app.on('mouse:down', this.onMouseDown);
    this.app.on('mouse:move', this.onMouseMove);
    this.app.on('mouse:up', this.onMouseUp);
    this.app.on('mouse:out', this.onMouseOut);
    this.enable = true;
  }

  public select(...nodes: KonvaNode[]): void {
    if (!this.enable) {
      return;
    }
    if (shapeArrayEqual(nodes, [...this.selected.values()])) {
      return;
    }
    this.cancelSelect();
    this.transformer.nodes(
      nodes.filter((node) => {
        node.draggable(true);
        this.selected.set(node.id(), node);
        return node !== this.rubberRect;
      })
    );
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
    const removed = nodes.map((node) => {
      node.draggable(false);
      return node.id();
    });
    removed.forEach((id) => this.selected.delete(id));
    this.transformer.nodes([...this.selected.values()]);
    this.app.emit('selected:changed', { selected: [...this.selected.values()] });
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
    if (!this.enable) {
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
    const inTransformer = pointInConvexPolygon(this.app.pointer, [
      new Point(x, y),
      new Point(x + width, y),
      new Point(x + width, y + height),
      new Point(x, y + height),
    ]);
    this.app.stage.container().style.cursor = inTransformer ? 'move' : 'default';
    if (!this.rubberEnable) {
      return;
    }
    // 如果弹性框选可用，则改变弹性框的尺寸
    const position = new Point(
      Math.min(this.app.pointer.x, this.rubberStartPoint.x),
      Math.min(this.app.pointer.y, this.rubberStartPoint.y)
    );
    this.rubberRect.setPosition(position);
    this.rubberRect.width(Math.max(this.app.pointer.x, this.rubberStartPoint.x) - position.x);
    this.rubberRect.height(Math.max(this.app.pointer.y, this.rubberStartPoint.y) - position.y);
    this.rubberRect.visible(true);
  };

  private onMouseUp = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.enable) {
      return;
    }
    if (this.rubberEnable) {
      this.select(...this.app.getShapesInArea(this.rubberRect));
    } else if (!(event.target instanceof Konva.Stage) && event.target.attrs.id) {
      if (this.multipleEnable) {
        if (this.selected.has(event.target.attrs.id)) {
          this.cancelSelect(event.target);
        } else {
          this.select(...this.selected.values(), event.target);
        }
      } else {
        this.select(event.target);
      }
    }
    this.rubberRect.visible(false);
    this.rubberEnable = false;
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
    this.app.off('mouse:out', this.onMouseOut);
    this.selected.clear();
    this.enable = false;
    this.transformer.destroy();
    this.optionLayer.destroy();
  }
}

export default Selector;
