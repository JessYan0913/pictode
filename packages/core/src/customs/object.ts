import { fabric } from 'fabric';

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

export const BaseObject = fabric.Object;
