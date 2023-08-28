import { Ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { useHotKey } from '@pictode/vue-aide';

export const useBindHotKey = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const moveDown = useHotKey(
    '[',
    () => {
      app.moveDown(...selected.value);
    },
    { exact: true, ctrlKey: true }
  );
  const moveUp = useHotKey(
    ']',
    () => {
      app.moveUp(...selected.value);
    },
    { exact: true, ctrlKey: true }
  );
  return {
    moveDown: {
      label: '下移一层',
      ...moveDown,
    },
    moveUp: {
      label: '上移一层',
      ...moveUp,
    },
  };
};

export default useBindHotKey;
