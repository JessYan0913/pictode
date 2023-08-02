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
  }

  private onMouseDown = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:down', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseDown) {
      return;
    }
    this.app.currentTool.onMouseDown({ event, app: this.app });
  };

  private onMouseUp = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:up', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseUp) {
      return;
    }
    this.app.currentTool.onMouseUp({ event, app: this.app });
  };

  private onMouseMove = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:move', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseMove) {
      return;
    }
    this.app.currentTool.onMouseMove({ event, app: this.app });
  };

  private onMouseOver = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:over', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseOver) {
      return;
    }
    this.app.currentTool.onMouseOver({ event, app: this.app });
  };

  private onMouseOut = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:out', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseOut) {
      return;
    }
    this.app.currentTool.onMouseOut({ event, app: this.app });
  };

  private onMouseDoubleClick = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:dbclick', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseDoubleClick) {
      return;
    }
    this.app.currentTool.onMouseDoubleClick({ event, app: this.app });
  };

  private onMouseClick = (event: KonvaMouseEvent): void => {
    this.app.emit('mouse:click', { event });
    if (!this.app.currentTool || !this.app.currentTool.onMouseClick) {
      return;
    }
    this.app.currentTool.onMouseClick({ event, app: this.app });
  };

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
