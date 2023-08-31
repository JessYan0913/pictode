import Konva from 'konva';

export class Point implements Konva.Vector2d {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setX(x: number) {
    this.x = x;
  }

  public setY(y: number) {
    this.y = y;
  }

  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public eq(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  public distanceTo(point: Point): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public midPointBtw(point: Point): Point {
    return new Point(this.x + (point.x - this.x) / 2, this.y + (point.y - this.y) / 2);
  }

  public toArray(): number[] {
    return [this.x, this.y];
  }

  public clone(point: Point): void {
    this.setXY(point.x, point.y);
  }
}

export const flatPoints = (points: Point[]): number[] =>
  points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);

export const pointInConvexPolygon = (point: Point, area: Point[]): boolean => {
  const x = point.x;
  const y = point.y;
  const count = area.length;
  let inInside = false;
  const precision = 2e-10;

  for (let i = 0, j = count - 1; i < count; j = i, i++) {
    const x1 = area[i].x;
    const y1 = area[i].y;
    const x2 = area[j].x;
    const y2 = area[j].y;

    if ((x1 === x && y1 === y) || (x2 === x && y2 === y)) {
      return true;
    }

    if (y === y1 && y === y2) {
      return true;
    }

    if ((y >= y1 && y < y2) || (y < y1 && y >= y2)) {
      const k = (x2 - x1) / (y2 - y1);
      const _x = x1 + k * (y - y1);

      if (_x === x) {
        return true;
      }

      if (Math.abs(_x - x) < precision) {
        return true;
      }

      if (_x > x) {
        inInside = !inInside;
      }
    }
  }

  return inInside;
};
