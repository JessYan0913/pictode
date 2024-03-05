import { Html, HtmlConfig, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

import { getIframeElement } from './utils';

export type IframeToolConfig = Omit<Partial<HtmlConfig>, 'content'> & {
  url?: string;
};

export interface IframeToolOptions {
  config?: IframeToolConfig;
  hooks?: ToolHooks;
}

export class IframeTool implements Tool {
  public name: string = 'iframeTool';
  public config?: IframeToolConfig;
  public hooks?: ToolHooks;
  private html: Html | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor({ config, hooks }: IframeToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.html) {
      return;
    }
    console.log('=====>', this.config);

    this.startPointer.clone(app.pointer);
    this.html = new Html({
      strokeScaleEnabled: false,
      content: getIframeElement(this.config?.url ?? ''),
      ...this.config,
    });
    this.html.setPosition(this.startPointer);
    this.html.width(0);
    this.html.height(0);
    app.add(this.html);
    this.hooks?.onStartDrawing?.(app, this.html);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.html) {
      return;
    }
    this.html.setPosition(
      new util.Point(Math.min(this.startPointer.x, app.pointer.x), Math.min(this.startPointer.y, app.pointer.y))
    );
    this.html.width(Math.abs(app.pointer.x - this.startPointer.x));
    this.html.height(Math.abs(app.pointer.y - this.startPointer.y));
    app.render();
  }

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.html) {
      return;
    }
    if (this.startPointer.eq(pointer)) {
      this.html?.destroy();
      this.html = null;
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.html);
    this.html = null;
    this.startPointer.setXY(0, 0);
  }
}

export default IframeTool;
