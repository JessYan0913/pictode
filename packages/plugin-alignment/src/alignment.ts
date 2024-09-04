import { App, KonvaNode } from '@pictode/core';
import { EnabledCheck } from '@pictode/utils';

import { Options } from './types';

export class Alignment {
  public app: App;
  public enabled: boolean;

  constructor(app: App, options: Options) {
    const { enabled } = options;
    this.app = app;
    this.enabled = enabled;
  }

  @EnabledCheck
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
      }),
    );
  }

  @EnabledCheck
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
      }),
    );
  }

  @EnabledCheck
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
      }),
    );
  }

  @EnabledCheck
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
      }),
    );
  }

  @EnabledCheck
  public alignCenterX(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const centerX = clientRects.reduce((sumX, rect) => sumX + (rect.x + rect.width / 2), 0) / clientRects.length;

    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetX = centerX - (clientRects[index].x + clientRects[index].width / 2);
        newNode.attrs = {
          ...newNode.attrs,
          x: newNode.attrs.x + offsetX,
        };
        return newNode;
      }),
    );
  }

  @EnabledCheck
  public alignCenterY(nodes: KonvaNode[]): void {
    const clientRects = nodes.map((node) => node.getClientRect());
    const centerY = clientRects.reduce((sumY, rect) => sumY + (rect.y + rect.height / 2), 0) / clientRects.length;

    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        const offsetY = centerY - (clientRects[index].y + clientRects[index].height / 2);
        newNode.attrs = {
          ...newNode.attrs,
          y: newNode.attrs.y + offsetY,
        };
        return newNode;
      }),
    );
  }

  @EnabledCheck
  public dispersionX(nodes: KonvaNode[]): void {
    const centerXValues = nodes.map((node) => node.getClientRect().x + node.getClientRect().width / 2);
    const isCenterXConsistent = centerXValues.every((value, index, arr) => value === arr[0]);
    if (isCenterXConsistent) {
      return;
    }
    this.distributeNodes(nodes, 'x');
  }

  @EnabledCheck
  public dispersionY(nodes: KonvaNode[]): void {
    const centerYValues = nodes.map((node) => node.getClientRect().y + node.getClientRect().height / 2);
    const isCenterYConsistent = centerYValues.every((value, index, arr) => value === arr[0]);
    if (isCenterYConsistent) {
      return;
    }
    this.distributeNodes(nodes, 'y');
  }

  private distributeNodes(nodes: KonvaNode[], key: 'x' | 'y'): void {
    if (nodes.length <= 2) {
      return;
    }
    nodes.sort((a, b) => a.getClientRect()[key] - b.getClientRect()[key]);

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    const firstValue =
      firstNode.getClientRect()[key] +
      (key === 'x' ? firstNode.getClientRect().width : firstNode.getClientRect().height);
    const space = lastNode.getClientRect()[key] - firstValue;
    const middleNodes = nodes.slice(1, -1);
    const middleValue = middleNodes.reduce(
      (middleValue, node) => middleValue + (key === 'x' ? node.getClientRect().width : node.getClientRect().height),
      0,
    );
    const gap = Math.max((space - middleValue) / (nodes.length - 1), 0);

    let curValue = firstValue;
    this.app.update(
      ...nodes.map((node, index) => {
        const newNode = node.toObject();
        if (index === 0 || index === nodes.length - 1) {
          return newNode;
        }
        const newValue = curValue + gap;
        // 先计算出包围盒的偏移量，再将偏移量加到坐标上
        newNode.attrs[key] = newValue - node.getClientRect()[key] + newNode.attrs[key];
        curValue = newValue + (key === 'x' ? node.getClientRect().width : node.getClientRect().height);
        return newNode;
      }),
    );
  }
}

export default Alignment;
