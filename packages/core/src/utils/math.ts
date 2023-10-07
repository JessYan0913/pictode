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

export const getMiddleValue = (array: number[]): number => {
  array.sort(function (a, b) {
    return a - b;
  });
  let middle = Math.floor(array.length / 2);
  return array[middle];
};

export const qrDecompose = (
  a: number[]
): {
  rotation: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
} => {
  let angle = Math.atan2(a[1], a[0]),
    denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
    scaleX = Math.sqrt(denom),
    scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX;

  return {
    rotation: angle / (Math.PI / 180),
    scaleX: scaleX,
    scaleY: scaleY,
    x: a[4],
    y: a[5],
  };
};

export const getGroupCoords = (node: Konva.Node, group: Konva.Group) => {
  let mB = node.getTransform().getMatrix();
  let mX = group.getTransform().getMatrix();

  //possible to replace with mB * mX.invert()
  let M = mB[0],
    N = mB[1],
    O = mB[2],
    P = mB[3],
    R = mB[4],
    S = mB[5],
    A = mX[0],
    B = mX[1],
    C = mX[2],
    D = mX[3],
    E = mX[4],
    F = mX[5],
    AD = A * D,
    BC = B * C,
    G = (C * N - M * D) / (BC - AD),
    H = (A * N - M * B) / (AD - BC),
    I = (C * P - O * D) / (BC - AD),
    J = (A * P - O * B) / (AD - BC),
    K = (C * (S - F) + D * (E - R)) / (BC - AD),
    L = (A * (S - F) + B * (E - R)) / (AD - BC);
  let matrix = [G, H, I, J, K, L],
    options = qrDecompose(matrix);

  return options;
};
