import Konva from 'konva';

export interface LinkConfig extends Konva.LineConfig {}

export class Link extends Konva.Line {
  public className: string = 'Line';

  constructor(config: LinkConfig) {
    super(config);
    this.on('pointsChange', (value) => {
      console.log('变化', value);
    });
  }

  public _setAttr(key: any, val: any): void {
    super._setAttr(key, val);
  }

  _remove(): void {
    super._remove();
  }
}

export default Link;
