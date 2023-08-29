import { App } from '../app';
import { KonvaMouseEvent, Service } from '../types';

export class Mouse extends Service {
  constructor(app: App) {
    super(app);

    this.app.stage.on<'mousedown'>('mousedown', this.onMouseDown);
    this.app.stage.on<'mouseup'>('mouseup', this.onMouseUp);
    this.app.stage.on<'mousemove'>('mousemove', this.onMouseMove);
    this.app.stage.on<'mouseover'>('mouseover', this.onMouseOver);
    this.app.stage.on<'mouseout'>('mouseout', this.onMouseOut);
    this.app.stage.on<'dblclick'>('dblclick', this.onMouseDoubleClick);
    this.app.stage.on<'click'>('click', this.onMouseClick);
    this.app.stage.on<'contextmenu'>('contextmenu', this.onMouseContextmenu);
  }

  private onMouseDown = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      this.app.stage.draggable(true);
      return;
    }
    this.app.emit('mouse:down', { event });
  };

  private onMouseUp = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:up', { event });
  };

  private onMouseMove = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:move', { event });
  };

  private onMouseOver = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:over', { event });
  };

  private onMouseOut = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:out', { event });
  };

  private onMouseDoubleClick = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:dbclick', { event });
  };

  private onMouseClick = (event: KonvaMouseEvent): void => {
    if (this.app.stage.draggable()) {
      return;
    }
    this.app.emit('mouse:click', { event });
  };

  private onMouseContextmenu = (event: KonvaMouseEvent): void => {
    this.app.triggerToolAvailability(false);
    this.app.emit('mouse:contextmenu', { event });
    setTimeout(() => this.app.triggerToolAvailability(true), 100);
  };

  public destroy(): void {
    this.app.stage.off('mousedown', this.onMouseDown);
    this.app.stage.off('mouseup', this.onMouseUp);
    this.app.stage.off('mousemove', this.onMouseMove);
    this.app.stage.off('mouseover', this.onMouseOver);
    this.app.stage.off('mouseout', this.onMouseOut);
    this.app.stage.off('dblclick', this.onMouseDoubleClick);
    this.app.stage.off('click', this.onMouseClick);
    this.app.stage.off('contextmenu', this.onMouseContextmenu);
  }
}
