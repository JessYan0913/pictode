import { Konva } from '@pictode/core';

class HtmlContainer extends Konva.Shape {
  public htmlElement: HTMLElement;

  constructor(config: Konva.ShapeConfig) {
    super(config);
    // 创建一个HTML元素，可以根据需要设置样式等属性
    this.htmlElement = document.createElement('div');
    this.htmlElement.style.position = 'absolute';
    this.htmlElement.style.zIndex = '10';
    this.htmlElement.style.top = '0px';
    this.htmlElement.style.left = '0px';
    this.htmlElement.style.transformOrigin = 'top left';

    // 将HTML元素添加到Konva.Stage的容器中
    const parent = this.getStage()?.container();
    if (parent && needForceStyle(parent)) {
      parent.style.position = 'relative';
    }
    parent?.appendChild(this.htmlElement);
  }

  draw() {
    const tr = this.getAbsoluteTransform();
    let attrs = tr.decompose();
    if (this.attrs.transformFunc) {
      attrs = this.attrs.transformFunc(attrs);
    }

    this.htmlElement.style.transform = `translate(${attrs.x}px, ${attrs.y}px) rotate(${attrs.rotation}deg) scaleX(${attrs.scaleX}) scaleY(${attrs.scaleY})`;

    // 应用其他样式和属性
    const { style, ...restProps } = this.attrs.divProps || {};
    Object.assign(this.htmlElement.style, style);
    Object.assign(this.htmlElement, restProps);

    return this;
  }

  shouldDraw() {
    return true;
  }

  removeHtmlElement() {
    // 移除HTML元素
    this.htmlElement.parentNode?.removeChild(this.htmlElement);
  }
}

function needForceStyle(el: HTMLElement) {
  const pos = window.getComputedStyle(el).position;
  const ok = pos === 'absolute' || pos === 'relative';
  return !ok;
}

export default HtmlContainer;
