import { BaseFabricObject, Ellipse } from 'fabric';

export class PEllipse extends Ellipse {
  public id: string;

  constructor(options: Partial<Ellipse> & { id: string }) {
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

export default PEllipse;
