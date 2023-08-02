import Konva from 'konva';

import { guid } from '../utils';

export class RegularPolygon extends Konva.RegularPolygon {
  constructor(config: Konva.RegularPolygonConfig) {
    super(config);
    if (this.id() === void 0) {
      this.id(guid());
    }
  }

  public draw(): this {
    return super.draw();
  }
}

export default RegularPolygon;
