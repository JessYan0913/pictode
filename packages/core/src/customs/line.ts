import Konva from 'konva';

import { guid } from '../utils';

export class Line extends Konva.Line {
  constructor(config: Konva.LineConfig) {
    super(config);
    if (this.id() === void 0) {
      this.id(guid());
    }
  }

  public draw(): this {
    return super.draw();
  }
}

export default Line;
