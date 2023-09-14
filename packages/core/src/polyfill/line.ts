import Konva from 'konva';

// 重写toObject方法
const originToObject = Konva.Line.prototype.toObject;
Konva.Line.prototype.toObject = function (): any {
  const object = originToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      x: this.getAbsolutePosition().x,
      y: this.getAbsolutePosition().y,
      strokeWidth: this.strokeWidth(),
      dash: this.dash(),
    },
  };
};
