import Konva from 'konva';

export class Triangle extends Konva.RegularPolygon {
  constructor(config: Konva.RegularPolygonConfig) {
    super({ ...config, sides: 3 });
  }

  public draw(): this {
    return super.draw();
  }
}

export default Triangle;
