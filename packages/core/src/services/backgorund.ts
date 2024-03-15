import Konva from 'konva';

import App from '../app';
import { Service } from '../types';

export class Background extends Service {
  private backgroundLayer: Konva.Layer;
  private background: Konva.Rect;

  constructor(app: App) {
    super(app);

    this.backgroundLayer = new Konva.Layer({
      name: 'pictode:background:layer',
    });
    this.background = new Konva.Rect({
      name: 'pictode:background:rect',
      x: this.app.stage.x(),
      y: 0,
      width: this.app.stage.width(),
      height: this.app.stage.height(),
      listening: false,
      opacity: 0.2,
    });
    this.backgroundLayer.add(this.background);
    this.app.stage.add(this.backgroundLayer);

    this.app.on('canvas:drag:move', this.setBackground);
  }

  private setBackground = (): void => {
    // ensure background rect is in the top-left of the canvas
    this.background.absolutePosition({ x: 0, y: 0 });

    // set the dimensions of the background rect to match the canvas - not the stage!!!
    this.background.size({
      width: this.app.stage.width() / this.app.stage.scaleX(),
      height: this.app.stage.height() / this.app.stage.scaleY(),
    });

    // Calculate the amount the stage is moved - including the effect of scaling
    const stagePos = {
      x: -this.app.stage.x() / this.app.stage.scaleX(),
      y: -this.app.stage.y() / this.app.stage.scaleY(),
    };

    // Apply that movement to the fill pattern
    this.background.fillPatternOffset(stagePos);
  };

  public destroy(): void {
    this.app.off('canvas:drag:move', this.setBackground);
  }
}
