import { RulerPlugin } from './index';

declare module '@pictode/core' {
  export interface App {}

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
}
