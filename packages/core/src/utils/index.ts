import { AppConfig, ChildType } from '../types';

export * from './math';

export { guid, readeFile, selectFile } from '@pictode/utils';

export const DEFAULT_APP_CONFIG: AppConfig = {
  backgroundColor: '#ffffff',
};

export const shapeArrayEqual = (arr1: ChildType[], arr2: ChildType[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false; // 长度不同，两个数组肯定不相同
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2.find((item) => item.id === obj1.id);

    if (!obj2) {
      return false;
    }

    if (!isShapeEqual(obj1, obj2)) {
      return false;
    }
  }

  return true;
};

const isShapeEqual = (obj1: ChildType, obj2: ChildType): boolean => {
  return obj1.id() === obj2.id() && obj1._id === obj2._id;
};
