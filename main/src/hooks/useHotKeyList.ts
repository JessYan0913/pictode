import { Ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { useCommandComponent, useHotKey } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';

export const useBindHotKey = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const messageBox = useCommandComponent(MessageBox);

  const moveDown = useHotKey(
    '[',
    () => {
      app.moveDown(...selected.value);
    },
    { directions: '下移一层', exact: true, ctrlKey: true }
  );
  const moveUp = useHotKey(
    ']',
    () => {
      app.moveUp(...selected.value);
    },
    { directions: '上移一层', exact: true, ctrlKey: true }
  );
  const moveBottom = useHotKey(
    '[',
    () => {
      app.moveBottom(...selected.value);
    },
    { directions: '置于底层', exact: true, ctrlKey: true, shiftKey: true }
  );
  const moveTop = useHotKey(
    ']',
    () => {
      app.moveTop(...selected.value);
    },
    { directions: '置于顶层', exact: true, ctrlKey: true, shiftKey: true }
  );
  const deleteNode = useHotKey(
    'Delete',
    () => {
      app.remove(...selected.value);
    },
    { directions: '删除' }
  );
  const selectAll = useHotKey(
    'a',
    () => {
      app.selectAll();
    },
    { directions: '全部选中', exact: true, ctrlKey: true }
  );
  const resetStage = useHotKey(
    'r',
    () => {
      messageBox({
        title: '清除画布',
        message: '将会清空画布内容，是否继续？',
        onSubmit: () => {
          app.clear();
          messageBox.close();
        },
      });
    },
    { directions: '重置画布', exact: true, ctrlKey: true }
  );
  const undo = useHotKey(
    'z',
    () => {
      app.undo();
    },
    { directions: '撤销', exact: true, ctrlKey: true }
  );
  const redo = useHotKey(
    'y',
    () => {
      app.redo();
    },
    { directions: '重做', exact: true, ctrlKey: true }
  );
  const stageDrag = useHotKey(
    ' ',
    () => {
      app.triggerPanning(true);
      return () => {
        app.triggerPanning(false);
      };
    },
    { directions: '移动画布' }
  );
  return {
    moveDown,
    moveUp,
    moveBottom,
    moveTop,
    deleteNode,
    selectAll,
    resetStage,
    undo,
    redo,
    stageDrag,
  };
};

export default useBindHotKey;
