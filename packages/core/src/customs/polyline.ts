import { fabric } from 'fabric';

export class Polyline extends fabric.Polyline {
  private selectedControl: string | null = null;
  private originalPoint: fabric.Point | null = null;

  public onSelect(options: { e?: Event | undefined }): boolean {
    const points = this.points ?? [];
    this.controls = points.reduce<Record<string, fabric.Control>>(
      (controls, point, index) => {
        controls[`p${index}`] = new fabric.Control({
          actionName: 'modifyPolyline',
          positionHandler(dim, finalMatrix, fabricObject: Polyline) {
            const x = point.x - fabricObject.pathOffset.x;
            const y = point.y - fabricObject.pathOffset.y;
            return fabric.util.transformPoint(
              new fabric.Point(x, y),
              fabric.util.multiplyTransformMatrices(
                fabricObject.canvas?.viewportTransform ?? [],
                fabricObject.calcTransformMatrix()
              )
            );
          },
          actionHandler: (eventData, transformData, x, y) => {
            // 更新点的位置
            points[index].x = x;
            points[index].y = y;
            // 重新设置points
            this.points = points;
            // 更新坐标
            this.setCoords();
            return true;
          },
        });
        return controls;
      },
      { ...this.controls }
    );
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
