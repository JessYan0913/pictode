import App from './app';

export interface Plugin {
  name: string;
  install(app: App, ...options: any[]): any;
  dispose(): void;
  enable?(): void;
  disable?(): void;
  isEnabled?(): boolean;
}

export interface EventArgs {}

export interface ControlVisible {
  bl?: boolean;
  br?: boolean;
  mb?: boolean;
  ml?: boolean;
  mr?: boolean;
  mt?: boolean;
  tl?: boolean;
  tr?: boolean;
  mtr?: boolean;
}

export interface ControlsOption {
  enable?: boolean;
  padding?: number;
  borderColor?: string;
  cornerColor?: string;
  connerStrokeColor?: string;
  cornerStyle?: 'rect' | 'circle';
  cornerSize?: number;
  rotatingPointOffset?: number;
  transparentCorners?: boolean;
  centeredScaling?: boolean;
  centeredRotation?: boolean;
  controlVisible?: ControlVisible;
}

export interface AppOption {
  backgroundColor?: string;
  controls?: ControlsOption;
}
