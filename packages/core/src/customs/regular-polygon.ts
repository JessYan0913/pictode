import Konva from 'konva';

export class RegularPolygon extends Konva.RegularPolygon {
  constructor(config: Konva.RegularPolygonConfig) {
    super(config);
  }

  public draw(): this {
    return super.draw();
  }
}

export default RegularPolygon;
