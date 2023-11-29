import { Konva } from '@pictode/core';

export class HtmlContainer extends Konva.Shape {
  public div: HTMLDivElement = document.createElement('div');
  public isMounted: boolean = false;

  constructor(config: Konva.ShapeConfig) {
    super(config);
    console.log('====>', this.getCanvas());

    this.on('absoluteTransformChange', () => {
      console.log('变化');
    });
  }

  _sceneFunc(context: Konva.Context) {
    let width = this.width(),
      height = this.height();
    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
    const container = this.getStage()?.container();
    if (!container) {
      return;
    }
    this.div.style.position = 'absolute';
    this.div.style.zIndex = '10';
    this.div.style.top = '0px';
    this.div.style.left = '0px';
    this.div.style.width = `${width}px`;
    this.div.style.height = `${height}px`;
    this.div.style.backgroundColor = 'green';
    this.div.style.transform = `translate(${this.attrs.x}px, ${this.attrs.y}px) rotate(${this.attrs.rotation}deg) scaleX(${this.attrs.scaleX}) scaleY(${this.attrs.scaleY})`;
    this.div.style.transformOrigin = 'top left';
  }
}

export default HtmlContainer;
