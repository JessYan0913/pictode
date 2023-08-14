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
    if (oldTool?.name === curTool.name) {
      return;
    }
    if (oldTool && typeof oldTool.inactive === 'function') {
      await oldTool.inactive(this.app);
    }
    this.currentTool = curTool;
    if (typeof this.currentTool.active === 'function') {
      await this.currentTool.active(this.app);
    }
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
    if (!this.available || !this.currentTool?.mousedown) {
      return;
    }
    this.currentTool.mousedown({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMouseup = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.available || !this.currentTool?.mouseup) {
      return;
    }
    this.currentTool.mouseup({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMousemove = ({ event }: EventArgs['mouse:move']): void => {
    if (!this.available || !this.currentTool?.mousemove) {
      return;
    }
    this.currentTool.mousemove({ event, pointer: this.app.pointer, app: this.app });
  };

  private onClick = ({ event }: EventArgs['mouse:click']): void => {
    if (!this.available || !this.currentTool?.click) {
      return;
    }
    this.currentTool.click({ event, pointer: this.app.pointer, app: this.app });
  };

  private onDoubleClick = ({ event }: EventArgs['mouse:dbclick']): void => {
    if (!this.available || !this.currentTool?.doubleClick) {
      return;
    }
    this.currentTool.doubleClick({ event, pointer: this.app.pointer, app: this.app });
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
