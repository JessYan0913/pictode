import { fabric } from 'fabric';

export class Polyline extends fabric.Polyline {
  public onSelect(options: { e?: Event | undefined }): boolean {
    const points = this.points ?? [];
    this.controls = points.reduce<Record<string, fabric.Control>>(
      (controls, point, index) => {
        controls[`p${index}`] = new fabric.Control({
          actionName: 'modifyPolyline',
          positionHandler: (dim, finalMatrix, fabricObject: Polyline): fabric.Point => {
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
          actionHandler: (eventData, transformData, x, y): boolean => {
            const polyline = transformData.target as Polyline;
            const invertedMatrix = fabric.util.invertTransform(polyline.calcTransformMatrix());
            const transformedPoint = fabric.util.transformPoint(new fabric.Point(x, y), invertedMatrix);
            // 更新点的位置
            points[index].x = transformedPoint.x + polyline.pathOffset.x;
            points[index].y = transformedPoint.y + polyline.pathOffset.y;
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

  public render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

export default Polyline;
