import Konva from 'konva';

import App from '../app';
import { BackgroundConfig, Service } from '../types';
import { generateSVG } from '../utils';

export class Background extends Service {
  private backgroundLayer: Konva.Layer;
  private background: Konva.Rect;
  private image?: HTMLImageElement;

  constructor(app: App, config?: BackgroundConfig) {
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

    if (config instanceof HTMLImageElement) {
      this.image = config;
      this.background.fillPatternImage(this.image);
    } else if (config) {
      this.image = new window.Image();
      const backgroundSvg = generateSVG(config.shape, config.padding, config.size, config.color);
      if (backgroundSvg) {
        this.image.src = backgroundSvg;
      }
      this.background.fillPatternImage(this.image);
    }
    this.app.on('canvas:resized', this.setBackground);
    this.app.on('canvas:drag:move', this.setBackground);
    this.app.on('canvas:zoom:end', this.setBackground);
  }

  public triggerVisible(visible?: boolean): void {
    this.background.visible(visible || !this.background.visible());
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
    this.app.off('canvas:resized', this.setBackground);
    this.app.off('canvas:drag:move', this.setBackground);
    this.app.off('canvas:zoom:end', this.setBackground);
  }
}
