import { BaseService } from '@pictode/utils';
import { fabric } from 'fabric';

import { Event } from './types';

export class Context extends BaseService<Event.ContextArgs> {
  private canvasElement: HTMLCanvasElement;
  private canvas: fabric.Canvas;

  constructor() {
    super();
    this.canvasElement = document.createElement('canvas');

    // 创建Fabric Canvas实例
    this.canvas = new fabric.Canvas(this.canvasElement);
    this.canvasElement.style.backgroundColor = 'lightgray';
    this.canvasElement.style.position = 'static';
    this.canvasElement.style.left = 'auto';
    this.canvasElement.style.top = 'auto';
    const canvas = this.canvas;
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

  public mount(element: HTMLElement) {
    element.appendChild(this.canvasElement);
    this.canvas.setDimensions({
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }
}

export default Context;
