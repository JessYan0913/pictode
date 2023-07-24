import { fabric } from 'fabric';

export class Circle extends fabric.Ellipse {
  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

export default Circle;
