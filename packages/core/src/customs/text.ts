import Konva from 'konva';

export class Text extends Konva.Text {
  constructor(config: Konva.TextConfig) {
    super(config);
  }

  public draw(): this {
    return super.draw();
  }
}

export default Text;
