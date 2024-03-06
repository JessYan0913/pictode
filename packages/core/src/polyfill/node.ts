import Konva from 'konva';

// 重写toObject方法
const originToObject = Konva.Node.prototype.toObject;
Konva.Node.prototype.toObject = function (this: Konva.Node): any {
  return originToObject.call(this);
};

// 重写remove方法
const originRemove = Konva.Node.prototype.remove;
Konva.Node.prototype.remove = function (this: Konva.Node) {
  originRemove.call(this);
  this.fire('removed', { target: this });
  return this;
};

// 重写MoveUp方法
const originMoveUp = Konva.Node.prototype.moveUp;
Konva.Node.prototype.moveUp = function (this: Konva.Node): boolean {
  const result = originMoveUp.call(this);
  if (result) {
    this.fire('move:up');
  }
  return result;
};

// 重写MoveDown方法
const originMoveDown = Konva.Node.prototype.moveDown;
Konva.Node.prototype.moveDown = function (this: Konva.Node): boolean {
  const result = originMoveDown.call(this);
  if (result) {
    this.fire('move:down');
  }
  return result;
};

// 重写MoveToTop方法
const originMoveToTop = Konva.Node.prototype.moveToTop;
Konva.Node.prototype.moveToTop = function (this: Konva.Node): boolean {
  const result = originMoveToTop.call(this);
  if (result) {
    this.fire('move:top');
  }
  return result;
};

// 重写MoveToBottom方法
const originMoveToBottom = Konva.Node.prototype.moveToBottom;
Konva.Node.prototype.moveToBottom = function (this: Konva.Node): boolean {
  const result = originMoveToBottom.call(this);
  if (result) {
    this.fire('move:bottom');
  }
  return result;
};

// 重写MoveTo方法
const originMoveTo = Konva.Node.prototype.moveTo;
Konva.Node.prototype.moveTo = function (this: Konva.Node, newContainer: Konva.Container) {
  const result = originMoveTo.call(this, newContainer);
  this.fire('move:to');
  return result;
};
