import { Konva, KonvaNode, util } from '@pictode/core';

export const transformPoint = (
  point: util.Point,
  originalTransform: Konva.Transform,
  targetTransform: Konva.Transform,
) => targetTransform.copy().invert().point(originalTransform.copy().point(point));

export const getNodeRect = (
  node: KonvaNode,
  padding: number = 0,
): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  const getAngle = (angle: number): number => {
    return Konva.angleDeg ? (angle * Math.PI) / 180 : angle;
  };
  const totalPoints: Array<util.Point> = [];
  let nodes: KonvaNode[] = [];
  if (node instanceof Konva.Group) {
    nodes = node.getChildren();
  } else {
    nodes = [node];
  }
  nodes.forEach((node) => {
    const box = node.getClientRect({ skipTransform: true, skipShadow: true });
    let points = [
      { x: box.x, y: box.y },
      { x: box.x + box.width, y: box.y },
      { x: box.x + box.width, y: box.y + box.height },
      { x: box.x, y: box.y + box.height },
    ];
    let trans = node.getAbsoluteTransform();
    points.forEach(function (point) {
      let transformed = trans.point(point);
      totalPoints.push(new util.Point(transformed.x, transformed.y));
    });
  });
  const tr = new Konva.Transform();
  tr.rotate(-getAngle(node.rotation()));
  let minX: number | undefined;
  let minY: number | undefined;
  let maxX: number | undefined;
  let maxY: number | undefined;
  totalPoints.forEach(function (point) {
    let transformed = tr.point(point);
    if (minX === undefined || minY === undefined || maxX === undefined || maxY === undefined) {
      minX = maxX = transformed.x;
      minY = maxY = transformed.y;
    }
    minX = Math.min(minX, transformed.x);
    minY = Math.min(minY, transformed.y);
    maxX = Math.max(maxX, transformed.x);
    maxY = Math.max(maxY, transformed.y);
  });
  tr.invert();
  const p = tr.point({ x: (minX ?? 0) - padding, y: (minY ?? 0) - padding });
  return {
    x: p.x,
    y: p.y,
    width: (maxX ?? 0) - (minX ?? 0) + padding * 2,
    height: (maxY ?? 0) - (minY ?? 0) + padding * 2,
  };
};
