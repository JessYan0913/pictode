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

  public toArray(): number[] {
    return [this.x, this.y];
  }

  public clone(point: Point): void {
    this.setXY(point.x, point.y);
  }
}

export const flatPoints = (points: Point[]): number[] =>
  points.reduce<number[]>((points, point) => [...points, ...point.toArray()], []);
