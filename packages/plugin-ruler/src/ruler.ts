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

  public update(): void {
    this.updateSize();
    this.updateScale();
    this.updatePosition();
    this.updateTicks();
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
    const rulerZero = this.axis === 'x' ? this.app.stage.x() : this.app.stage.y();
    const rulerLength = this.axis === 'x' ? this.width : this.height;
    const axisScale = this.axis === 'x' ? this.app.stage.scaleX() : this.app.stage.scaleY();
    const displayStep = 40 / axisScale;
    const rulerStep = displayStep * axisScale;
    const ticksBackward = -Math.ceil(rulerZero / rulerStep);
    const ticksForward = Math.ceil((rulerLength - rulerZero) / rulerStep);
    const tickPosStart = rulerZero + ticksBackward * rulerStep;
    const tickPosEnd = rulerZero + ticksForward * rulerStep;

    const dataSteps = [];
    let tickCnt = 0;
    let tickTag = Math.floor((ticksBackward * displayStep) / 10) * 10; // 设置刻度数字的标记间隔

    for (let i = tickPosStart; i < tickPosEnd; i = i + rulerStep) {
      dataSteps.push(this.axis === 'x' ? `M${i},0 L${i},${5}` : `M${i},${5} L${5},{i}`);
      if (this.tickTexts.length < tickCnt + 1) {
        const tick = this.tickText?.clone({ text: tickTag, width: 100 });
        tick.align(this.axis === 'x' ? 'center' : 'left');
        tick.name('tickText' + this.axis);
        this.tickTexts[tickCnt] = tick;
        this.tickMarkGroup.add(tick);
      }

      this.tickTexts[tickCnt].setAttrs({
        x: this.axis === 'x' ? i - this.tickTexts[tickCnt].width() / 2 : 10,
        y: this.axis === 'x' ? 10 : i - this.tickTexts[tickCnt].height() / 2,
        text: Math.floor(tickTag),
        visible: true,
      });
      tickCnt = tickCnt + 1;
      tickTag = tickTag + displayStep;
    }

    this.ticks.data(dataSteps.join(' '));
  }
}
