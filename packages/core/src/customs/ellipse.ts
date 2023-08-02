import Konva from 'konva';

import { guid } from '../utils';

export class Ellipse extends Konva.Ellipse {
  constructor(config: Konva.EllipseConfig) {
    super(config);
    if (this.id() === void 0) {
      this.id(guid());
    }
  }

  public draw(): this {
    return super.draw();
  }
}

export default Ellipse;
