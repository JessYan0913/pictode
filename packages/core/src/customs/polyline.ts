import { fabric } from 'fabric';

export class Polyline extends fabric.Polyline {
  public onSelect(options: { e?: Event | undefined }): boolean {
    return super.onSelect(options);
  }

  public onDeselect(options: { e?: Event | undefined; object?: fabric.Object | undefined }): boolean {
    return super.onDeselect(options);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

export default Polyline;
