import Konva from 'konva';

import { guid } from '../utils';

export class Image extends Konva.Image {
  constructor(config: Konva.ImageConfig) {
    super(config);
    if (this.id() === void 0) {
      this.id(guid());
    }
  }

  public draw(): this {
    return super.draw();
  }
}

export default Image;
