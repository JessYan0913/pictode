import { RulerPlugin } from './index';

declare module '@pictode/core' {
  export interface App {
    triggerRulerVisible(visible?: boolean): void;
    rulerUpdate(): void;
  }

  export interface EventArgs {
    'ruler:installed': {
      ruler: RulerPlugin;
    };
    'ruler:destroy': {
      ruler: RulerPlugin;
    };
  }
}

export type RulerAxis = 'x' | 'y';

export interface Options {
  enabled: boolean;
  axis: RulerAxis[] | RulerAxis;
  jump: number;
  fill: string;
  thickness: number;
}
