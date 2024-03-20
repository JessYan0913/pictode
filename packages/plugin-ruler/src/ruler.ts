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
      y: axis === 'x' ? 0 : this.stage.y(),
      clip: {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      },
      listening: false,
    });

    this.rulerFill = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.axis === 'x' ? width : thickness,
      height: this.axis === 'x' ? thickness : height,
      fill,
    });

    const clip = {
      x: axis === 'x' ? thickness - 5 : 0,
      y: axis === 'x' ? 0 : thickness - 5,
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

  public get rulerShape() {
    return this.ruler;
  }

  public update() {
    // 更新 ruler 的缩放以匹配 stage 的缩放
    this.ruler.scale({
      x: 1 / this.stage.scaleX(),
      y: 1 / this.stage.scaleY(),
    });

    // 更新 ruler 的位置以匹配 stage 的位置
    const stagePos = {
      x: -this.stage.x() / this.stage.scaleX(),
      y: -this.stage.y() / this.stage.scaleY(),
    };
    this.ruler.position(stagePos);

    // 清除之前的刻度和文本
    this.ticks.data('');
    this.tickTexts.forEach((text) => text.destroy());
    this.tickTexts = [];

    // 重新计算刻度
    const scale = this.axis === 'x' ? this.stage.scaleX() : this.stage.scaleY();
    const size = this.axis === 'x' ? this.width : this.height;
    const step = 100; // 刻度间隔，可根据需要调整
    const numTicks = Math.floor(size / (step * scale));

    let dataSteps = [];
    for (let i = 0; i <= numTicks; i++) {
      const pos = i * step * scale;
      const lineCommand =
        this.axis === 'x' ? `M${pos},0 L${pos},${this.tickLength}` : `M0,${pos} L${this.tickLength},${pos}`;
      dataSteps.push(lineCommand);

      // 添加刻度文本
      const text = `${i * step}`;
      const tickText = new Konva.Text({
        x: this.axis === 'x' ? pos - 10 : 0,
        y: this.axis === 'x' ? 10 : pos - 5,
        text: text,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'black',
      });
      this.tickMarkGroup.add(tickText);
      this.tickTexts.push(tickText);
    }

    // 应用新的刻度路径
    this.ticks.data(dataSteps.join(' '));
  }

  public updateSize() {
    let newWidth = this.width;
    let newHeight = this.height;

    if (this.axis === 'x') {
      newWidth = this.stage.width();
      this.width = newWidth;
      this.rulerFill.width(newWidth);
      this.ruler.clipWidth(newWidth);
    } else {
      newHeight = this.stage.height();
      this.height = newHeight;
      this.rulerFill.height(newHeight);
      this.ruler.clipHeight(newHeight);
    }

    // 更新 tickMarkGroup 的 clip 区域以匹配新的尺寸
    const clip = {
      x: this.axis === 'x' ? 0 : 0,
      y: this.axis === 'x' ? 0 : 0,
      width: this.axis === 'x' ? newWidth : this.rulerFill.width(),
      height: this.axis === 'x' ? this.rulerFill.height() : newHeight,
    };
    this.tickMarkGroup.clip(clip);

    this.update(); // 重新计算和绘制尺标
  }
}

export default Ruler;
