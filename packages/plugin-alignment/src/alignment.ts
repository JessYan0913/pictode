import { App, KonvaNode, util } from '@pictode/core';

import { Options } from './types';

export class Alignment {
  public app: App;
  public options?: Options;

  constructor(app: App, options?: Options) {
    this.app = app;
    this.options = options;
  }

  public alignLeft(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const minX = Math.min(...clientRects.map((node) => node.x));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetX = clientRects[index].x - minX;
        newNode.attrs = {
          ...newNode.attrs,
          x: newNode.attrs.x - offsetX,
        };
        return newNode;
      })
    );
  }

  public alignRight(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const maxX = Math.max(...clientRects.map((node) => node.x + node.width));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetX = maxX - (clientRects[index].x + clientRects[index].width);
        newNode.attrs = {
          ...newNode.attrs,
          x: newNode.attrs.x + offsetX,
        };
        return newNode;
      })
    );
  }

  public alignTop(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const minY = Math.min(...clientRects.map((node) => node.y));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetY = clientRects[index].y - minY;
        newNode.attrs = {
          ...newNode.attrs,
          y: newNode.attrs.y - offsetY,
        };
        return newNode;
      })
    );
  }

  public alignBottom(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const maxY = Math.max(...clientRects.map((node) => node.y + node.height));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetY = maxY - (clientRects[index].y + clientRects[index].height);
        newNode.attrs = {
          ...newNode.attrs,
          y: newNode.attrs.y + offsetY,
        };
        return newNode;
      })
    );
  }

  public alignCenterX(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const centerX = util.getMiddleValue(clientRects.map((node) => node.x + node.width / 2));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetX = clientRects[index].x - centerX;
        newNode.attrs = {
          ...newNode.attrs,
          x: newNode.attrs.x - offsetX,
        };
        return node;
      })
    );
  }

  public alignCenterY(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const centerY = util.getMiddleValue(clientRects.map((node) => node.y + node.height / 2));
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetY = clientRects[index].y - centerY;
        newNode.attrs = {
          ...newNode.attrs,
          y: newNode.attrs.y - offsetY,
        };
        return node;
      })
    );
  }

  public destroy(): void {}
}

export default Alignment;