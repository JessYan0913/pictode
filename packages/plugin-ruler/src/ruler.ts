import { App, Konva } from '@pictode/core';

import { RulerAxis } from './types';

export class Ruler {
  private ruler: Konva.Group;
  private rulerFill: Konva.Rect; // Changed to a class property
  private tickMarkGroup: Konva.Group;
  private ticks: Konva.Path;
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
    // Clear existing ticks and texts
    this.ticks.destroy();
    this.tickTexts.forEach((text) => text.destroy());
    this.ticks.data('');
    this.tickTexts = [];

    // Recalculate and redraw ticks and texts
    this.drawTicks();
  }

  private drawTicks(): void {
    const minTick = 10; // 设置最小刻度
    const interval = 10; // 设置显示刻度数字的间隔
    const tickLength = 10; // 设置刻度线长度
    const numTicks = this.axis === 'x' ? Math.floor(this.width / minTick) : Math.floor(this.height / minTick);

    const ticksPath = Array.from({ length: numTicks + 1 }, (_, i) => {
      const position = i * minTick;
      return `M${this.axis === 'x' ? position : 0} ${this.axis === 'x' ? 0 : position} L${
        this.axis === 'x' ? position : tickLength
      } ${this.axis === 'x' ? tickLength : position}`;
    }).join(' ');

    this.ticks.data(ticksPath);

    this.tickMarkGroup.add(this.ticks);

    for (let i = 0; i <= numTicks; i++) {
      if (i % interval === 0) {
        const position = i * minTick;
        const text = new Konva.Text({
          x: this.axis === 'x' ? position - 5 : 20,
          y: this.axis === 'x' ? 20 : position - 5,
          text: String(position),
          fontSize: 12,
          fontFamily: 'Arial',
          fill: 'black',
        });
        this.tickMarkGroup.add(text);
      }
    }
  }
}
