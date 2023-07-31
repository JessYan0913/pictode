import Konva from 'konva';

import { App } from '../app';
import { Rect } from '../customs/rect';
import { ChildType, Service } from '../types';

export class Selector extends Service {
  public selected: ChildType[];
  public optionLayer: Konva.Layer;

  private selector: Konva.Transformer;
  private rubberRect: Rect;

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
  }

  public select(...children: ChildType[]): void {
    this.selected.forEach((child) => child.draggable(false));
    this.selected = [];
    this.selector.nodes([]);
    children.forEach((child) => {
      child.draggable(true);
      this.selected.push(child);
    });
    this.selector.nodes(children);
    this.selector.moveToTop();
    this.app.render();
  }

  public dispose(): void {
    this.selected = [];
    this.selector.destroy();
    this.optionLayer.destroy();
  }
}

export default Selector;
