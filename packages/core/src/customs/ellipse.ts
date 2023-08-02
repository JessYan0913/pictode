import Konva from 'konva';

export class Ellipse extends Konva.Ellipse {
  constructor(config: Konva.EllipseConfig) {
    super(config);
  }

  public draw(): this {
    return super.draw();
  }
}

export default Ellipse;
