import { App, Konva } from '@pictode/core';

import { RulerAxis } from './types';

export class Ruler {
  private ruler: Konva.Group;
  private rulerFill: Konva.Rect; // Changed to a class property
  private tickMarkGroup: Konva.Group;
  private ticks: Konva.Line[] = [];
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

    // Add the ruler to the layer
    this.app.add(this.ruler);

    // Initial update to draw ticks
    this.update();
  }

  public get rulerShape(): Konva.Group {
    return this.ruler;
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
    this.ticks.forEach((tick) => tick.destroy());
    this.tickTexts.forEach((text) => text.destroy());
    this.ticks = [];
    this.tickTexts = [];

    // Recalculate and redraw ticks and texts
    this.drawTicks();
  }

  private drawTicks(): void {
    const numTicks = this.axis === 'x' ? Math.floor(this.width / 100) : Math.floor(this.height / 100);
    for (let i = 0; i <= numTicks; i++) {
      const position = i * 100;
      const tick = new Konva.Line({
        points: this.axis === 'x' ? [position, 0, position, 10] : [0, position, 10, position],
        stroke: 'black',
      });
      this.tickMarkGroup.add(tick);
      this.ticks.push(tick);

      const text = new Konva.Text({
        x: this.axis === 'x' ? position - 5 : 15,
        y: this.axis === 'x' ? 15 : position - 5,
        text: String(i * 100),
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'black',
      });
      this.tickMarkGroup.add(text);
      this.tickTexts.push(text);
    }
  }
}
