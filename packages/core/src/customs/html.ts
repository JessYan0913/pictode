import Konva from 'konva';

export interface HtmlConfig extends Konva.ShapeConfig {
  content?: HTMLElement;
}

const needForceStyle = (el: HTMLElement): boolean => {
  const pos = window.getComputedStyle(el).position;
  const ok = pos === 'absolute' || pos === 'relative';
  return !ok;
};

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

  public _setAttr(key: any, val: any): void {
    if (key === 'content') {
      this.setContent(val);
    } else {
      super._setAttr(key, val);
    }
  }

  public setContent(content: HTMLElement) {
    this.content = content;
    this.htmlDiv.innerHTML = '';
    this.htmlDiv.appendChild(this.content);
  }

  public _sceneFunc(context: Konva.Context) {
    const width = this.width();
    const height = this.height();

    context.beginPath();
    context.rect(0, 0, width, height);
    context.closePath();
    context.fillStrokeShape(this);
    this.addHtmlToStage();
    this.handleTransform();
  }

  private addHtmlToStage() {
    const stage = this.getStage();
    const parent = stage?.container();

    if (!parent || parent === this.htmlDiv.parentElement) {
      return;
    }

    parent.appendChild(this.htmlDiv);

    if (needForceStyle(parent)) {
      parent.style.position = 'relative';
    }

    this.on('absoluteTransformChange', this.handleTransform);
    this.on('dblclick', this.handleDblclick);
  }

  private handleDblclick() {
    this.htmlDiv.style.pointerEvents = 'auto';
  }

  private handleTransform() {
    const tr = this.getAbsoluteTransform();
    const attrs = tr.decompose();

    this.htmlDiv.style.position = 'absolute';
    this.htmlDiv.style.top = '0px';
    this.htmlDiv.style.left = '0px';
    this.htmlDiv.style.width = `${this.width() * attrs.scaleX}px`;
    this.htmlDiv.style.height = `${this.height() * attrs.scaleY}px`;
    this.htmlDiv.style.transform = `translate(${attrs.x}px, ${attrs.y}px) rotate(${attrs.rotation}deg)`;
    this.htmlDiv.style.transformOrigin = 'top left';
    this.htmlDiv.style.pointerEvents = 'none';

    const { style, ...restProps } = this.attrs.divProps || {};
    Object.assign(this.htmlDiv.style, style);
    Object.assign(this.htmlDiv, restProps);
  }

  _remove(): void {
    super._remove();
    this.htmlDiv.parentElement?.removeChild(this.htmlDiv);
    this.off('absoluteTransformChange', this.handleTransform);
    this.off('dblclick', this.handleDblclick);
  }
}

export default Html;
