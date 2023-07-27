import { Control, Point, Polyline, TPointerEvent, util } from 'fabric';

export class PPolyline extends Polyline {
  public onSelect(options: { e?: TPointerEvent | undefined }): boolean {
    const points = this.points ?? [];
    this.controls = points.reduce<Record<string, Control>>(
      (controls, point, index) => {
        controls[`p${index}`] = new Control({
          actionName: 'modifyPolyline',
          positionHandler: (dim, finalMatrix, fabricObject: PPolyline): Point => {
            const x = point.x - fabricObject.pathOffset.x;
            const y = point.y - fabricObject.pathOffset.y;
            return util.transformPoint(
              new Point(x, y),
              util.multiplyTransformMatrices(
                fabricObject.canvas?.viewportTransform ?? [0, 0, 0, 0, 0, 0],
                fabricObject.calcTransformMatrix()
              )
            );
          },
          actionHandler: (eventData, transformData, x, y): boolean => {
            const polyline = transformData.target as PPolyline;
            const invertedMatrix = util.invertTransform(polyline.calcTransformMatrix());
            const transformedPoint = util.transformPoint(new Point(x, y), invertedMatrix);
            // 更新点的位置
            points[index].x = transformedPoint.x + polyline.pathOffset.x;
            points[index].y = transformedPoint.y + polyline.pathOffset.y;
            // 重新设置points
            polyline.set({ points });
            polyline.setCoords();
            polyline.setDimensions();
            polyline.canvas?.renderAll();
            return true;
          },
        });
        return controls;
      },
      { ...this.controls }
    );
    return super.onSelect(options);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

export default PPolyline;
