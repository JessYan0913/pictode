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

    this.optionLayer.add(this.selector);

    this.rubberRect = new Rect({
      stroke: 'red',
      dash: [2, 2],
      listening: false,
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

  private onMouseDown(): void {
    if (!this.enable) {
      return;
    }
    this.rubberStartPoint.clone(this.app.pointer);
    this.rubberRect.setPosition(this.rubberStartPoint);
  }

  private onMouseMove({ event }: EventArgs['mouse:move']): void {
    if (!this.enable) {
      return;
    }
    if (event.target instanceof Konva.Stage) {
      document.body.style.cursor = 'default';
    } else {
      document.body.style.cursor = 'move';
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
    this.rubberRect.visible(false);
  }

  private onMouseClick({ event }: EventArgs['mouse:click']): void {
    if (!this.enable) {
      return;
    }
    if (event.target instanceof Konva.Stage) {
      this.select();
    } else {
      this.select(event.target);
    }
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
