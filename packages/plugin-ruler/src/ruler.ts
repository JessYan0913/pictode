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
  private tickTexts: Konva.Text[];
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
    this.tickTexts = [];

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

  public update() {
    this.ruler.scale({
      x: 1 / this.stage.scaleX(),
      y: 1 / this.stage.scaleY(),
    });
    const stagePos = {
      x: -this.stage.x() / this.stage.scaleX(),
      y: -this.stage.y() / this.stage.scaleY(),
    };
    const list = this.stage.find('.tickText' + this.axis);
    for (const tick of list) {
      tick.setAttr('visible', false);
    }

    this.ruler.position(stagePos);
    // Calculate the zero point on the ruler
    const rulerZero = this.axis === 'x' ? this.stage.x() : this.stage.y();

    // get the ruler length
    const rulerLength = this.axis === 'x' ? this.width : this.height;

    // Note the scale in force
    const axisScale = this.axis === 'x' ? this.stage.scaleX() : this.stage.scaleY();

    // displayStep is the jumps in the number displayed on the tick marks
    let displayStep = 40 / axisScale;

    // rulerStep is the gap between ruler tick marks we will draw, and
    // the position of the text.
    const rulerStep = displayStep * axisScale;

    // how many ticks from zero pt back to start and end of ruler?
    const ticksBackward = -Math.ceil(rulerZero / rulerStep);
    const ticksForward = Math.ceil((rulerLength - rulerZero) / rulerStep);

    // Which makes the positions in px
    const tickPosStart = rulerZero + ticksBackward * rulerStep;
    const tickPosEnd = rulerZero + ticksForward * rulerStep;

    // And gives a total px distance from ruler start to end of
    // const totalDist = tickPosEnd - tickPosStart;

    // used to create path output
    let dataSteps = [];

    //
    let tickCnt = 0; // used to count ticks

    // Set up the text for the first ruler marker
    let tickTag = ticksBackward * displayStep;

    // Loop for each ruler mark
    for (let i = tickPosStart; i < tickPosEnd; i = i + rulerStep) {
      // Construct the path command for the tick mark
      dataSteps.push(
        this.axis === 'x' ? `M${i},0 L${i},${this.tickLength}` : `M${i},${this.tickLength} L$${this.tickLength},{i}`
      );

      // Manage the tick mark text
      if (this.tickTexts.length < tickCnt + 1) {
        const tick = this.tickText.clone({ text: tickTag, width: 100 });
        tick.align(this.axis === 'x' ? 'center' : 'left');
        tick.name('tickText' + this.axis);
        this.tickTexts[tickCnt] = tick;
        this.tickMarkGroup.add(tick);
      }

      // Update the tick number
      this.tickTexts[tickCnt].setAttrs({
        x: this.axis === 'x' ? i - this.tickTexts[tickCnt].width() / 2 : 10,
        y: this.axis === 'x' ? 10 : i - this.tickTexts[tickCnt].height() / 2,
        text: tickTag,
        visible: true,
      });

      tickCnt = tickCnt + 1;

      tickTag = tickTag + displayStep;
    }

    // Apply that path data that we constructed.
    this.ticks.data(dataSteps.join(' '));
  }
}

export default Ruler;
