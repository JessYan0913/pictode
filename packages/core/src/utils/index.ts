import { AppConfig, KonvaNode } from '../types';

export * from './math';

export { guid, readeFile, selectFile } from '@pictode/utils';

export const DEFAULT_APP_CONFIG: AppConfig = {
  backgroundColor: '#ffffff',
};

export const shapeArrayEqual = (nodes1: KonvaNode[], nodes2: KonvaNode[]): boolean => {
  if (nodes1.length !== nodes2.length) {
    return false; // 长度不同，两个数组肯定不相同
  }

  for (let i = 0; i < nodes1.length; i++) {
    const obj1 = nodes1[i];
    const obj2 = nodes2.find((item) => item.id === obj1.id);

    if (!obj2) {
      return false;
    }

    if (!isShapeEqual(obj1, obj2)) {
      return false;
    }
  }

  return true;
};

const isShapeEqual = (node1: KonvaNode, node2: KonvaNode): boolean => {
  return node1.attrs.id === node1.attrs.id && node1._id === node2._id;
};
