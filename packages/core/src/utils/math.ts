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

  public toArray(): number[] {
    return [this.x, this.y];
  }
}
