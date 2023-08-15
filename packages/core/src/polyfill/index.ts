import Konva from 'konva';

const originToObject = Konva.Node.prototype.toObject;
const newToObject = function (this: Konva.Node): any {
  const object = originToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      scaleX: this.scaleX() ?? 1,
      scaleY: this.scaleY() ?? 1,
      rotation: this.rotation() ?? 0,
      opacity: this.opacity(),
    },
  };
};
Konva.Node.prototype.toObject = newToObject;

Konva.Rect.prototype.toObject = function (): any {
  const object = newToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
    },
  };
};

Konva.Ellipse.prototype.toObject = function (): any {
  const object = newToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
    },
  };
};

Konva.RegularPolygon.prototype.toObject = function (): any {
  const object = newToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
    },
  };
};

Konva.Line.prototype.toObject = function (): any {
  const object = newToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
    },
  };
};

Konva.Text.prototype.toObject = function (): any {
  const object = newToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
    },
  };
};
