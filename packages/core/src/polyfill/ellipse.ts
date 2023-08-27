import Konva from 'konva';

// 重写toObject方法
const originToObject = Konva.Ellipse.prototype.toObject;
Konva.Ellipse.prototype.toObject = function (): any {
  const object = originToObject.call(this);
  return {
    ...object,
    attrs: {
      ...object.attrs,
      strokeWidth: this.strokeWidth(),
      dash: this.dash(),
    },
  };
};
