import { App, Konva } from '@pictode/core';

import { RulerAxis } from './types';

export class Ruler {
  private ruler: Konva.Group;
  private rulerFill: Konva.Rect; // Changed to a class property
  private tickMarkGroup: Konva.Group;
  private ticks: Konva.Path;
  private tickText?: Konva.Text;
  private tickTexts: Konva.Text[] = [];
  private width: number; // 声明 width 属性
  private height: number; // 声明 height 属性

  constructor(
    private app: App,
    private axis: RulerAxis = 'x',
    private fill: string = 'red',
    private thickness: number = 40
  ) {
    this.width = app.stage.width();
    this.height = app.stage.height();

    // Initialize the ruler group
    this.ruler = new Konva.Group({
      x: 0,
      y: 0,
      clip: { x: 0, y: 0, width: this.width, height: this.height },
    });

    // Create and add the ruler fill
    this.rulerFill = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.axis === 'x' ? this.width : this.thickness,
      height: this.axis === 'x' ? this.thickness : this.height,
      fill: this.fill,
    });
    this.ruler.add(this.rulerFill);

    // Initialize the tick mark group
    this.tickMarkGroup = new Konva.Group();
    this.ruler.add(this.tickMarkGroup);

    this.ticks = new Konva.Path({
      data: '',
      stroke: 'black',
    });
    this.ruler.add(this.ticks);

    this.tickText = new Konva.Text({
      fill: 'black',
      fontSize: 10,
      fontFamily: 'Calibri',
      text: '',
      align: 'center',
    });

    // Add the ruler to the layer
    this.app.add(this.ruler);

    // Initial update to draw ticks
    this.update();
  }

  public updateSize(newWidth: number, newHeight: number): void {
    this.width = newWidth;
    this.height = newHeight;
    this.ruler.clip({ x: 0, y: 0, width: newWidth, height: newHeight });

    // Directly update rulerFill size
    if (this.axis === 'x') {
      this.rulerFill.width(newWidth);
      this.ruler.width(newWidth);
    } else {
      this.rulerFill.height(newHeight);
      this.ruler.height(newHeight);
    }

    this.update();
  }

  public update(): void {
    this.ruler.scale({
      x: 1 / this.app.stage.scaleX(),
      y: 1 / this.app.stage.scaleY(),
    });
    const stagePos = {
      x: -this.app.stage.x() / this.app.stage.scaleX(),
      y: -this.app.stage.y() / this.app.stage.scaleY(),
    };

    const list = this.app.stage.find('.tickText' + this.axis);
    for (const tick of list) {
      tick.setAttr('visible', false);
    }

    this.ruler.position(stagePos);

    const rulerZero = this.axis === 'x' ? this.app.stage.x() : this.app.stage.y();

    const rulerLength = this.axis === 'x' ? this.width : this.height;

    const axisScale = this.axis === 'x' ? this.app.stage.scaleX() : this.app.stage.scaleY();

    let displayStep = 40 / axisScale;

    const rulerStep = displayStep * axisScale;

    const ticksBackward = -Math.ceil(rulerZero / rulerStep);
    const ticksForward = Math.ceil((rulerLength - rulerZero) / rulerStep);

    const tickPosStart = rulerZero + ticksBackward * rulerStep;
    const tickPosEnd = rulerZero + ticksForward * rulerStep;

    let dataSteps = [];

    let tickCnt = 0;

    let tickTag = ticksBackward * displayStep;

    for (let i = tickPosStart; i < tickPosEnd; i = i + rulerStep) {
      // Construct the path command for the tick mark
      dataSteps.push(this.axis === 'x' ? `M${i},0 L${i},${5}` : `M${i},${5} L$${5},{i}`);

      // Manage the tick mark text
      if (this.tickTexts.length < tickCnt + 1) {
        const tick = this.tickText?.clone({ text: tickTag, width: 100 });
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
