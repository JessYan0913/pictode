import { App, Konva } from '@pictode/core';

import { Options, RulerAxis } from './types';

export class Ruler {
  private ruler: Konva.Group;
  private rulerFill: Konva.Rect; // Changed to a class property
  private tickMarkGroup: Konva.Group;
  private ticks: Konva.Path;
  private tickText: Konva.Text;
  private tickTexts: Konva.Text[] = [];
  private width: number; // 声明 width 属性
  private height: number; // 声明 height 属性
  public axis: RulerAxis = 'x';
  public jump: number = 50;
  public fill: string = '#ffffff';
  public thickness: number = 40;

  constructor(
    private app: App,
    axis: RulerAxis,
    options: Omit<Options, 'axis'>
  ) {
    this.axis = axis;
    this.jump = options.jump;
    this.fill = options.fill;
    this.thickness = options.thickness;

    this.width = app.stage.width();
    this.height = app.stage.height();

    // Initialize the ruler group
    this.ruler = new Konva.Group({
      name: `pictode:ruler:${axis}`,
      x: 0,
      y: 0,
      clip: { x: 0, y: 0, width: this.width, height: this.height },
    });

    // Create and add the ruler fill
    this.rulerFill = new Konva.Rect({
      name: `pictode:ruler:${axis}:fill`,
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
      name: `pictode:ruler:${axis}:path`,
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
    this.app.optionLayer.add(this.ruler);

    this.app.on('canvas:resized', this.update);
    this.app.on('canvas:drag:move', this.update);
    this.app.on('canvas:zoom:end', this.update);

    // Initial update to draw ticks
    this.update();
    this.triggerVisible(options.enabled);
  }

  public destroy(): void {
    this.app.off('canvas:resized', this.update);
    this.app.off('canvas:drag:move', this.update);
    this.app.off('canvas:zoom:end', this.update);

    this.ruler.remove();
  }

  public get visible(): boolean {
    return this.ruler.visible();
  }

  public update = (): void => {
    this.updateSize();
    this.updateScale();
    this.updatePosition();
    this.updateTicks();
  };

  public triggerVisible(visible: boolean): void {
    this.ruler.visible(visible);
    this.update();
  }

  private updateSize(): void {
    this.width = this.app.stage.width();
    this.height = this.app.stage.height();
    this.ruler.clip({ x: 0, y: 0, width: this.width, height: this.height });

    // Directly update rulerFill size
    if (this.axis === 'x') {
      this.rulerFill.width(this.width);
      this.ruler.width(this.width);
    } else {
      this.rulerFill.height(this.height);
      this.ruler.height(this.height);
    }
  }

  private updateScale(): void {
    const scaleX = 1 / this.app.stage.scaleX();
    const scaleY = 1 / this.app.stage.scaleY();
    this.ruler.scale({ x: scaleX, y: scaleY });
  }

  private updatePosition(): void {
    const stagePos = {
      x: -this.app.stage.x() / this.app.stage.scaleX(),
      y: -this.app.stage.y() / this.app.stage.scaleY(),
    };
    this.ruler.position(stagePos);
  }

  private updateTicks(): void {
    const stage = this.app.stage;
    // Calculate the zero point on the ruler
    const rulerZero = this.axis === 'x' ? stage.x() : stage.y();

    // get the ruler length
    const rulerLength = this.axis === 'x' ? this.width : this.height;

    // Note the scale in force
    const axisScale = this.axis === 'x' ? stage.scaleX() : stage.scaleY();

    // displayStep is the jumps in the number displayed on the tick marks
    let displayStep = this.jump / axisScale;

    // rulerStep is the gap between ruler tick marks we will draw, and
    // the position of the text.
    const rulerStep = displayStep * axisScale;

    // how many ticks from zero pt back to start and end of ruler?
    const ticksBackward = -Math.ceil(rulerZero / rulerStep);
    const ticksForward = Math.ceil((rulerLength - rulerZero) / rulerStep);

    // Which makes the positions in px
    const tickPosStart = rulerZero + ticksBackward * rulerStep;
    const tickPosEnd = rulerZero + ticksForward * rulerStep;

    // used to create path output
    let dataSteps = [];

    //
    let tickCnt = 0; // used to count ticks

    // Set up the text for the first ruler marker
    let tickTag = ticksBackward * displayStep;

    const tickLength = 5;

    // Loop for each ruler mark
    for (let i = tickPosStart; i < tickPosEnd; i = i + rulerStep) {
      // Construct the path command for the tick mark
      dataSteps.push(this.axis === 'x' ? `M${i},0 L${i},${tickLength}` : `M0,${i} L$${tickLength},${i}`);

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
        text: Math.floor(tickTag),
        visible: true,
      });

      tickCnt = tickCnt + 1;

      tickTag = tickTag + displayStep;
    }

    // Apply that path data that we constructed.
    this.ticks.data(dataSteps.join(' '));
  }
}
