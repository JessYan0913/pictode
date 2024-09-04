import { Iframe, IframeConfig, Tool, ToolEvent, ToolHooks, util } from '@pictode/core';

export type IframeToolConfig = Partial<IframeConfig>;

export interface IframeToolOptions {
  config?: IframeToolConfig;
  hooks?: ToolHooks;
}

export class IframeTool implements Tool {
  public name: string = 'iframeTool';
  public config?: IframeToolConfig;
  public hooks?: ToolHooks;
  private iframe: Iframe | null = null;
  private startPointer: util.Point = new util.Point(0, 0);

  constructor({ config, hooks }: IframeToolOptions) {
    this.config = config;
    this.hooks = hooks;
  }

  public mousedown({ app }: ToolEvent) {
    if (this.iframe) {
      return;
    }

    this.startPointer.clone(app.pointer);
    this.iframe = new Iframe({
      strokeScaleEnabled: false,
      ...this.config,
    });
    this.iframe.setPosition(this.startPointer);
    this.iframe.width(0);
    this.iframe.height(0);
    app.add(this.iframe);
    this.hooks?.onStartDrawing?.(app, this.iframe);
  }

  public mousemove({ app }: ToolEvent) {
    if (!this.iframe) {
      return;
    }
    this.iframe.setPosition(
      new util.Point(Math.min(this.startPointer.x, app.pointer.x), Math.min(this.startPointer.y, app.pointer.y)),
    );
    this.iframe.width(Math.abs(app.pointer.x - this.startPointer.x));
    this.iframe.height(Math.abs(app.pointer.y - this.startPointer.y));
    app.render();
  }

  public mouseup({ app, pointer }: ToolEvent) {
    if (!this.iframe) {
      return;
    }
    if (this.startPointer.eq(pointer)) {
      this.iframe?.destroy();
      this.iframe = null;
      return;
    }
    this.hooks?.onCompleteDrawing?.(app, this.iframe);
    this.iframe = null;
    this.startPointer.setXY(0, 0);
  }
}

export default IframeTool;
