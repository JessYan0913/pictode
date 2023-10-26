import { isFunction } from '@pictode/utils';

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

  public async setTool(curTool: Tool | null): Promise<void> {
    const oldTool = this.currentTool;
    if (oldTool?.name === curTool?.name) {
      return;
    }
    if (oldTool?.hooks && isFunction(oldTool?.hooks?.onInactive)) {
      await oldTool.hooks.onInactive(this.app, oldTool);
    }
    this.currentTool = curTool;
    if (this.currentTool?.hooks && isFunction(this.currentTool?.hooks?.onActive)) {
      await this.currentTool.hooks.onActive(this.app, this.currentTool);
    }
    this.app.render();
    this.app.emit('tool:changed', { oldTool, curTool });
  }

  public trigger(enabled?: boolean): void {
    let oldEnable = this.enable;
    if (enabled === void 0) {
      this.enable = !this.enable;
    } else {
      this.enable = enabled;
    }
    if (this.currentTool?.enableChanged) {
      this.currentTool.enableChanged(oldEnable, this.enable);
    }
  }

  private onMousedown = ({ event }: EventArgs['mouse:down']): void => {
    if (!this.available || !this.currentTool?.mousedown || event.evt.button !== 0) {
      return;
    }
    this.currentTool.mousedown({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMouseup = ({ event }: EventArgs['mouse:up']): void => {
    if (!this.available || !this.currentTool?.mouseup || event.evt.button !== 0) {
      return;
    }
    this.currentTool.mouseup({ event, pointer: this.app.pointer, app: this.app });
  };

  private onMousemove = ({ event }: EventArgs['mouse:move']): void => {
    if (!this.available || !this.currentTool?.mousemove || event.evt.button !== 0) {
      return;
    }
    this.currentTool.mousemove({ event, pointer: this.app.pointer, app: this.app });
  };

  private onClick = ({ event }: EventArgs['mouse:click']): void => {
    if (!this.available || !this.currentTool?.click || event.evt.button !== 0) {
      return;
    }
    this.currentTool.click({ event, pointer: this.app.pointer, app: this.app });
  };

  private onDoubleClick = ({ event }: EventArgs['mouse:dbclick']): void => {
    if (!this.available || !this.currentTool?.doubleClick || event.evt.button !== 0) {
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
