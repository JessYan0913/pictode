import { BaseFabricObject, Rect } from 'fabric';

export class PRect extends Rect {
  public id: string;

  constructor(options: Partial<Rect> & { id: string }) {
    super(options);
    this.id = options.id;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }

  public toJSON(): BaseFabricObject {
    return { ...super.toJSON(), id: this.id };
  }
}

export default PRect;
