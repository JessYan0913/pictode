import Konva from 'konva';

export class Rect extends Konva.Rect {
  constructor(config: Konva.RectConfig) {
    super(config);
  }

  public draw(): this {
    return super.draw();
  }
}

export default Rect;
