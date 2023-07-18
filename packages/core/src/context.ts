import { BaseService } from '@pictode/utils';
import { fabric } from 'fabric';

import { Event } from './types';

export class Context extends BaseService<Event.ContextArgs> {
  private _canvasElement: HTMLCanvasElement;
  private _canvas: fabric.Canvas;

  constructor() {
    super();
    this._canvasElement = document.createElement('canvas');

    // 创建Fabric Canvas实例
    this._canvas = new fabric.Canvas(this._canvasElement);
    this._canvasElement.style.backgroundColor = 'lightgray';
    this._canvasElement.style.position = 'static';
    this._canvasElement.style.left = 'auto';
    this._canvasElement.style.top = 'auto';
    const canvas = this._canvas;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: 'red',
    });

    canvas.add(rect);
    canvas.renderAll();
  }

  public get canvasElement() {
    return this._canvasElement;
  }

  public get canvas() {
    return this._canvas;
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.canvasElement);
    this.canvas.setDimensions({
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }
}

export default Context;
