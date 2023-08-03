import { App } from '../app';
import { EventArgs, Service, Tool } from '../types';

export class Tooler extends Service {
  public currentTool: Tool | null = null;
  private enable: boolean = true;

  constructor(app: App) {
    super(app);

    this.app.on('mouse:down', this.onMousedown);
    this.app.on('mouse:move', this.onMousemove);
    this.app.on('mouse:up', this.onMouseup);
    this.app.on('mouse:click', this.onClick);
    this.app.on('mouse:dbclick', this.onDoubleClick);
  }

  public get available(): boolean {
    return this.currentTool !== null && this.enable && !this.app.stage.draggable();
  }

  public async setTool(curTool: Tool): Promise<void> {
    const oldTool = this.currentTool;
    if (oldTool && typeof oldTool.onInactive === 'function') {
      await oldTool.onInactive(this.app);
    }
    this.currentTool = curTool;
    await this.currentTool.onActive(this.app);
    this.app.render();
    this.app.emit('tool:changed', { oldTool, curTool });
  }

  public triggerAvailability(enable?: boolean): void {
    if (enable === void 0) {
      this.enable = !this.enable;
    } else {
      this.enable = enable;
    }
  }

  private onMousedown = ({ event }: EventArgs['mouse:down']): void => {
    if (!this.available || !this.currentTool?.onMouseDown) {
      return;
    }
    this.currentTool.onMouseDown({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMouseup = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.available || !this.currentTool?.onMouseUp) {
      return;
    }
    this.currentTool.onMouseUp({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMousemove = ({ event }: EventArgs['mouse:move']): void => {
    if (!this.available || !this.currentTool?.onMouseMove) {
      return;
    }
    this.currentTool.onMouseMove({ event, pointer: this.app.pointer, app: this.app });
  };

  private onClick = ({ event }: EventArgs['mouse:click']): void => {
    if (!this.available || !this.currentTool?.onMouseClick) {
      return;
    }
    this.currentTool.onMouseClick({ event, pointer: this.app.pointer, app: this.app });
  };

  private onDoubleClick = ({ event }: EventArgs['mouse:dbclick']): void => {
    if (!this.available || !this.currentTool?.onMouseDoubleClick) {
      return;
    }
    this.currentTool.onMouseDoubleClick({ event, pointer: this.app.pointer, app: this.app });
  };

  public destroy(): void {
    this.app.off('mouse:down', this.onMousedown);
    this.app.off('mouse:move', this.onMousemove);
    this.app.off('mouse:up', this.onMouseup);
    this.app.off('mouse:click', this.onClick);
    this.app.off('mouse:dbclick', this.onDoubleClick);
    this.currentTool = null;
  }
}

export default Tooler;
