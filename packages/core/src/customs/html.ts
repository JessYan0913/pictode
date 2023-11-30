import Konva from 'konva';

export interface HtmlConfig extends Konva.ShapeConfig {
  content?: HTMLElement;
}

export class Html extends Konva.Shape {
  public className: string = 'Html';
  public htmlDiv: HTMLDivElement = document.createElement('div');
  public content?: HTMLElement;

  constructor(config: HtmlConfig) {
    super(config);

    this.content = config.content;
    if (this.content) {
      this.htmlDiv.appendChild(this.content);
    }
  }

  handleTransform() {
    const shouldTransform = this.attrs.shouldTransform ?? true;

    if (shouldTransform) {
      const tr = this.getAbsoluteTransform();
      const attrs = tr.decompose();

      this.htmlDiv.style.position = 'absolute';
      this.htmlDiv.style.zIndex = '10';
      this.htmlDiv.style.top = '0px';
      this.htmlDiv.style.left = '0px';
      this.htmlDiv.style.width = `${this.width()}px`;
      this.htmlDiv.style.height = `${this.height()}px`;
      this.htmlDiv.style.transform = `translate(${attrs.x}px, ${attrs.y}px) rotate(${attrs.rotation}deg) scaleX(${attrs.scaleX}) scaleY(${attrs.scaleY})`;
      this.htmlDiv.style.transformOrigin = 'top left';
      this.htmlDiv.style.pointerEvents = 'none';
    } else {
      this.htmlDiv.style.position = '';
      this.htmlDiv.style.zIndex = '';
      this.htmlDiv.style.top = '';
      this.htmlDiv.style.left = '';
      this.htmlDiv.style.transform = '';
      this.htmlDiv.style.transformOrigin = '';
    }

    const { style, ...restProps } = this.attrs.divProps || {};
    Object.assign(this.htmlDiv.style, style);
    Object.assign(this.htmlDiv, restProps);
  }

  _sceneFunc(context: Konva.Context) {
    const width = this.width();
    const height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
    this.addHtmlToStage();
  }

  addHtmlToStage() {
    const stage = this.getStage();
    const parent = stage?.container();

    if (!parent) {
      return;
    }

    parent.appendChild(this.htmlDiv);

    if (this.attrs.shouldTransform && this.needForceStyle(parent)) {
      parent.style.position = 'relative';
    }

    this.on('absoluteTransformChange', this.handleTransform);
    this.handleTransform();
  }

  removeHtmlFromStage() {
    const parent = this.getStage()?.container();
    parent?.removeChild(this.htmlDiv);
    parent?.removeEventListener('absoluteTransformChange', this.handleTransform);
  }

  needForceStyle(el: HTMLElement) {
    const pos = window.getComputedStyle(el).position;
    const ok = pos === 'absolute' || pos === 'relative';
    return !ok;
  }
}

export default Html;
