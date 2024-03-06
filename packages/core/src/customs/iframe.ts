import Html, { HtmlConfig } from './html';

export type IframeConfig = Omit<Partial<HtmlConfig>, 'content'> & {
  src?: string;
};

export class Iframe extends Html {
  public className: string = 'Iframe';
  public iframeElement: HTMLIFrameElement = document.createElement('iframe');

  constructor(config: IframeConfig) {
    super(config);

    this.iframeElement.src = config.src ?? '';
    this.iframeElement.style.border = 'none';
    this.iframeElement.style.width = '100%';
    this.iframeElement.style.height = '100%';
    this.iframeElement.style.display = 'block';
    this.iframeElement.style.margin = '0';
    this.iframeElement.style.boxSizing = 'border-box';

    super.setContent(this.iframeElement);
  }

  public _setAttr(key: any, val: any): void {
    if (key === 'src' && this.iframeElement) {
      this.iframeElement.src = val;
    } else {
      super._setAttr(key, val);
    }
  }
}

export default Iframe;
