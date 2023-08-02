import Konva from 'konva';

import { guid } from '../utils';

export class Rect extends Konva.Rect {
  constructor(config: Konva.RectConfig) {
    super(config);
    if (this.id() === void 0) {
      this.id(guid());
    }
  }

  public draw(): this {
    return super.draw();
  }
}

export default Rect;
