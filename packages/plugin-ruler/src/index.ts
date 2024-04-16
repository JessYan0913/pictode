import { App, Plugin } from '@pictode/core';
import { EnabledCheck } from '@pictode/utils';

import './method';

import { Ruler } from './ruler';
import { Options, RulerAxis } from './types';

const DEFAULT_OPTIONS: Options = {
  enabled: true,
  axis: 'x',
  jump: 50,
  thickness: 40,
  fill: '#ffffff',
};

export class RulerPlugin implements Plugin {
  public name: string = 'rulerPlugin';
  public app?: App;
  public options: Options;
  public rulers: Ruler[];
  private axis: RulerAxis[];

  constructor(options?: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.axis = [];
    this.rulers = [];
    if (typeof this.options.axis === 'string') {
      this.axis = [this.options.axis];
    } else {
      this.axis = this.options.axis;
    }
  }

  public get enabled(): boolean {
    return this.isEnabled();
  }

  public install(app: App) {
    this.app = app;
    for (const axis of this.axis) {
      this.rulers = this.rulers || [];
      this.rulers.push(new Ruler(this.app, axis, { ...this.options }));
    }
    this.app.emit('ruler:installed', { ruler: this });
  }

  public destroy(): void {
    this.rulers.forEach((ruler) => ruler.destroy());
    this.app?.emit('ruler:destroy', { ruler: this });
  }

  public enable(): void {
    this.rulers.forEach((ruler) => ruler.triggerVisible(true));
  }

  public disable(): void {
    this.rulers.forEach((ruler) => ruler.triggerVisible(false));
  }

  public isEnabled(): boolean {
    return this.rulers.some((ruler) => ruler.visible);
  }

  public triggerVisible(visible?: boolean): void {
    const rulerVisible = visible || !this.isEnabled();
    this.rulers.forEach((ruler) => ruler.triggerVisible(rulerVisible));
  }

  @EnabledCheck
  public update(): void {
    this.rulers.forEach((ruler) => ruler.update());
  }
}

export default RulerPlugin;
