import { fabric } from 'fabric';

const isTransparent = (color: string): boolean => {
  return new fabric.Color(color).getAlpha() === 0;
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
      const strokeWidth = this.strokeWidth || 1; // 边框宽度，默认为 1
      const distanceToTop = Math.abs(point.y - boundingRect.top);
      const distanceToBottom = Math.abs(point.y - boundingRect.top - boundingRect.height);
      const distanceToLeft = Math.abs(point.x - boundingRect.left);
      const distanceToRight = Math.abs(point.x - boundingRect.left - boundingRect.width);
      const onBorder =
        distanceToTop <= strokeWidth + tolerance ||
        distanceToBottom <= strokeWidth + tolerance ||
        distanceToLeft <= strokeWidth + tolerance ||
        distanceToRight <= strokeWidth + tolerance;
      return onBorder;
    }
    return super.containsPoint(point, lines, absolute, calculate);
  }

  public _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx);
  }
}

export default Rect;
