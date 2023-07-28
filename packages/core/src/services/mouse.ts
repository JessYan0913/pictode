import { App } from '../app';
import { KonvaMouseEvent, Service } from '../types';

export class MouseService extends Service {
  constructor(app: App) {
    super(app);
    (
      [
        'onMouseDown',
        'onMouseUp',
        'onMouseMove',
        'onMouseDoubleClick',
        'onMouseOver',
        'onMouseOut',
        'onMouseClick',
      ] as (keyof this)[]
    ).forEach((method) => {
      method = method as keyof MouseService;
      this[method] = (this[method] as Function).bind(this);
    });

    this.app.stage.on<'mousedown'>('mousedown', this.onMouseDown);
    this.app.stage.on('mouseup', this.onMouseUp);
    this.app.stage.on('mousemove', this.onMouseMove);
    this.app.stage.on('mouseover', this.onMouseOver);
    this.app.stage.on('mouseout', this.onMouseOut);
    this.app.stage.on('dblclick', this.onMouseDoubleClick);
    this.app.stage.on('click', this.onMouseClick);
  }

  private onMouseDown(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseDown) {
      return;
    }
    this.app.currentTool.onMouseDown({ event, app: this.app });
  }

  private onMouseUp(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseUp) {
      return;
    }
    this.app.currentTool.onMouseUp({ event, app: this.app });
  }

  private onMouseMove(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseMove) {
      return;
    }
    this.app.currentTool.onMouseMove({ event, app: this.app });
  }

  private onMouseOver(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseOver) {
      return;
    }
    this.app.currentTool.onMouseOver({ event, app: this.app });
  }

  private onMouseOut(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseOut) {
      return;
    }
    this.app.currentTool.onMouseOut({ event, app: this.app });
  }

  private onMouseDoubleClick(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseDoubleClick) {
      return;
    }
    this.app.currentTool.onMouseDoubleClick({ event, app: this.app });
  }

  private onMouseClick(event: KonvaMouseEvent): void {
    if (!this.app.currentTool || !this.app.currentTool.onMouseClick) {
      return;
    }
    this.app.currentTool.onMouseClick({ event, app: this.app });
  }

  public dispose(): void {
    this.app.stage.off('mousedown', this.onMouseDown);
    this.app.stage.off('mouseup', this.onMouseUp);
    this.app.stage.off('mousemove', this.onMouseMove);
    this.app.stage.off('mouseover', this.onMouseOver);
    this.app.stage.off('mouseout', this.onMouseOut);
    this.app.stage.off('dblclick', this.onMouseDoubleClick);
    this.app.stage.off('click', this.onMouseClick);
  }
}
