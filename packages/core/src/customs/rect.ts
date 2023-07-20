import { fabric } from 'fabric';

const isTransparent = (color: string): boolean => {
  const alpha = new fabric.Color(color).getAlpha();
  return alpha === 0;
};

export class Rect extends fabric.Rect {
  public containsPoint(
    point: fabric.Point,
    lines?: any,
    absolute?: boolean | undefined,
    calculate?: boolean | undefined
  ): boolean {
    const activeObjects = this.canvas?.getActiveObjects();
    const isFillTransparent = typeof this.fill === 'string' ? isTransparent(this.fill) : false;
    if (isFillTransparent && !activeObjects?.includes(this)) {
      const tolerance = 3;
      const boundingRect = this.getBoundingRect();
      const distanceToTop = Math.abs(point.y - boundingRect.top);
      const distanceToBottom = Math.abs(point.y - boundingRect.top - boundingRect.height);
      const distanceToLeft = Math.abs(point.x - boundingRect.left);
      const distanceToRight = Math.abs(point.x - boundingRect.left - boundingRect.width);
      return (
        distanceToTop <= tolerance ||
        distanceToBottom <= tolerance ||
        distanceToLeft <= tolerance ||
        distanceToRight <= tolerance
      );
    }
    return super.containsPoint(point, lines, absolute, calculate);
  }

  public _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx);
  }
}

export default Rect;
