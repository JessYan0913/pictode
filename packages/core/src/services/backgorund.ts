import Konva from 'konva';

import App from '../app';
import { Service } from '../types';
import { generateSVG } from '../utils';

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
    this.backgroundLayer.moveToBottom();

    const image = new window.Image();
    image.onload = () => {
      this.background.fillPatternImage(image);
    };
    const backgroundSvg = generateSVG('circle', 40, 2.5, '#100100');
    if (backgroundSvg) {
      image.src = backgroundSvg;
    }
    this.app.on('canvas:resized', this.setBackground);
    this.app.on('canvas:drag:move', this.setBackground);
    this.app.on('canvas:zoom:end', this.setBackground);
  }

  private setBackground = (): void => {
    // ensure background rect is in the top-left of the canvas
    this.background.absolutePosition({ x: 0, y: 0 });

    // set the dimensions of the background rect to match the canvas - not the stage!!!
    this.background.size({
      width: this.app.stage.width() / this.app.stage.scaleX(),
      height: this.app.stage.height() / this.app.stage.scaleY(),
    });

    // Apply that movement to the fill pattern
    this.background.fillPatternOffset({
      x: -this.app.stage.x() / this.app.stage.scaleX(),
      y: -this.app.stage.y() / this.app.stage.scaleY(),
    });
  };

  public destroy(): void {
    this.app.off('canvas:drag:move', this.setBackground);
  }
}
