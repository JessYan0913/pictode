import Konva from 'konva';

import { App } from '../app';
import { Rect } from '../customs/rect';
import { ChildType, EventArgs, Service } from '../types';
import { Point } from '../utils';

export class Selector extends Service {
  public selected: ChildType[];
  public optionLayer: Konva.Layer;
  public enable: boolean = false;

  private selector: Konva.Transformer;
  private rubberRect: Rect;
  private rubberStartPoint: Point = new Point(0, 0);
  private rubberEnable: boolean = false;

  constructor(app: App) {
    super(app);
    this.selected = [];
    this.optionLayer = new Konva.Layer();
    this.optionLayer.name('pictode:option:layer');
    this.app.stage.add(this.optionLayer);

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

    this.optionLayer.add(this.selector);

    this.rubberRect = new Rect({
      stroke: 'rgb(157, 157, 231)',
      fill: 'rgba(157, 157, 231, 0.5)',
      strokeWidth: 2,
    });
    this.optionLayer.add(this.rubberRect);

    (['onMouseDown', 'onMouseUp', 'onMouseMove', 'onMouseClick'] as (keyof this)[]).forEach((method) => {
      method = method as keyof Selector;
      this[method] = (this[method] as Function).bind(this);
    });

    this.app.on('mouse:down', this.onMouseDown);
    this.app.on('mouse:move', this.onMouseMove);
    this.app.on('mouse:up', this.onMouseUp);
    this.app.on('mouse:click', this.onMouseClick);
  }

  public select(...children: ChildType[]): void {
    if (!this.enable) {
      return;
    }
    this.selected.forEach((child) => child.draggable(false));
    this.selected = [];
    this.selector.nodes([]);
    children.forEach((child) => {
      child.draggable(true);
      this.selected.push(child);
    });
    this.selector.nodes(children);
    this.app.render();
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

  private onMouseDown({ event }: EventArgs['mouse:down']): void {
    if (!this.enable) {
      return;
    }
    if (event.target instanceof Konva.Stage) {
      this.select();
      this.rubberStartPoint.clone(this.app.pointer);
      this.rubberRect.setPosition(this.rubberStartPoint);
      this.rubberRect.width(0);
      this.rubberRect.height(0);
      this.rubberRect.visible(false);
      this.rubberEnable = true;
    }
  }

  private onMouseMove({ event }: EventArgs['mouse:move']): void {
    if (!this.enable) {
      return;
    }
    if (event.target instanceof Konva.Stage || !this.app.isPointInArea(this.app.pointer, this.selector.toObject())) {
      document.body.style.cursor = 'default';
    } else {
      document.body.style.cursor = 'move';
    }
    if (!this.rubberEnable) {
      return;
    }
    const position = new Point(
      Math.min(this.app.pointer.x, this.rubberStartPoint.x),
      Math.min(this.app.pointer.y, this.rubberStartPoint.y)
    );
    const width = Math.max(this.app.pointer.x, this.rubberStartPoint.x) - position.x;
    const height = Math.max(this.app.pointer.y, this.rubberStartPoint.y) - position.y;
    this.rubberRect.setPosition(position);
    this.rubberRect.width(width);
    this.rubberRect.height(height);
    this.rubberRect.visible(true);
  }

  private onMouseUp(): void {
    if (!this.enable) {
      return;
    }
    if (this.rubberEnable) {
      this.app.getShapesInArea(this.rubberRect).then((res) => this.select(...res));
    }
    this.rubberRect.visible(false);
    this.rubberEnable = false;
  }

  private onMouseClick({ event }: EventArgs['mouse:click']): void {
    if (event.target instanceof Konva.Stage) {
      return;
    }
    this.select(event.target);
  }

  public dispose(): void {
    this.app.off('mouse:down', this.onMouseDown);
    this.app.off('mouse:move', this.onMouseMove);
    this.app.off('mouse:up', this.onMouseUp);
    this.app.off('mouse:click', this.onMouseClick);
    this.selected = [];
    this.enable = false;
    this.selector.destroy();
    this.optionLayer.destroy();
  }
}

export default Selector;
