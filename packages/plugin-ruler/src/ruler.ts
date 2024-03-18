import { Konva } from '@pictode/core';

import { RulerAxis } from './types';

export class Ruler {
  private tickLength: number;
  private width: number;
  private height: number;

  private axis: RulerAxis = 'x';
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private ruler: Konva.Group;
  private rulerFill: Konva.Rect;
  private ticks: Konva.Path;
  private tickText: Konva.Text;
  private tickMarkGroup: Konva.Group;

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    width: number,
    height: number,
    axis: RulerAxis = 'x',
    fill: string = 'red',
    thickness: number = 40
  ) {
    this.tickLength = 10;
    this.axis = axis;
    this.stage = stage;
    this.layer = layer;

    this.width = width;
    this.height = height;

    this.ruler = new Konva.Group({
      x: axis === 'x' ? this.stage.x() : 0,
      y: axis === 'y' ? 0 : this.stage.y(),
      clip: {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      },
    });

    this.rulerFill = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.axis === 'x' ? width : thickness,
      height: this.axis === 'y' ? thickness : height,
      fill,
    });

    const clip = {
      x: axis === 'x' ? thickness - 5 : 0,
      y: axis === 'y' ? 0 : thickness - 5,
    };
    this.tickMarkGroup = new Konva.Group({
      clip: {
        ...clip,
        width: this.width - clip.x,
        height: this.height - clip.y,
      },
    });

    this.ticks = new Konva.Path({ stroke: 'black' });
    this.tickText = new Konva.Text({
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Calibri',
      text: '',
      align: 'center',
    });

    this.tickMarkGroup.add(this.ticks);
    this.ruler.add(this.rulerFill, this.tickMarkGroup);
  }
}

export default Ruler;
