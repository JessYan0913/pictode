import Konva from 'konva';

export class Image extends Konva.Image {
  constructor(config: Konva.ImageConfig) {
    super(config);
  }

  public draw(): this {
    return super.draw();
  }
}

export default Image;
