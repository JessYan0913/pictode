import { BaseFabricObject, Triangle } from 'fabric';

export class PTriangle extends Triangle {
  public id: string;

  constructor(options: Partial<Triangle> & { id: string }) {
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

export default PTriangle;
