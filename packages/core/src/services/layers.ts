import Konva from 'konva';

import { App } from '../app';
import { Service } from '../types';

export class Layers extends Service {
  public layers: Map<string, Konva.Layer>;
  public currentLayer: Konva.Layer;
  private layerId: number = 0;

  constructor(app: App) {
    super(app);
    this.layerId = 0;
    this.layers = new Map();
    this.currentLayer = this.createLayer(`${this.layerId}`);
    this.layers.set(this.currentLayer.name(), this.currentLayer);
    this.app.stage.add(this.currentLayer);
  }

  private createLayer(id: string): Konva.Layer {
    return new Konva.Layer({
      id,
    });
  }

  public add(...ids: string[]): Konva.Layer[] {
    if (ids.length === 0) {
      ids = [`${this.layerId++}`];
    }
    return ids.map((id) => {
      const layer = this.createLayer(id);
      this.layers.set(id, layer);
      this.app.stage.add(layer);
      return layer;
    });
  }

  public remove(...ids: string[]): void {
    ids.forEach((id) => this.layers.get(id)?.remove());
  }

  public get(...ids: string[]): Konva.Layer[] {
    if (ids.length === 0) {
      return this.app.stage.getLayer();
    }
    return ids.reduce<Konva.Layer[]>((layers, id) => {
      const layer = this.layers.get(id);
      if (layer) {
        layers.push(layer);
      }
      return layers;
    }, []);
  }

  public active(id: string): Konva.Layer {
    const layer = this.layers.get(id);
    if (!layer) {
      throw new Error('id 图层不存在');
    }
    this.currentLayer = layer;
    return this.currentLayer;
  }

  public destroy(): void {
    this.layerId = 0;
    this.layers.clear();
    this.currentLayer = this.createLayer(`${this.layerId}`);
    this.layers.set(this.currentLayer.id(), this.currentLayer);
    this.app.stage.add(this.currentLayer);
  }
}

export default Layers;
