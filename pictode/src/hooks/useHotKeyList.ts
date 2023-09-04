import { Ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { useCommandComponent, useHotKey } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';

export const useBindHotKey = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const messageBox = useCommandComponent(MessageBox);

  const moveDown = useHotKey(
    () => {
      app.moveDown(...selected.value);
    },
    { key: '[', directions: '下移一层', exact: true, ctrlKey: true }
  );
  const moveUp = useHotKey(
    () => {
      app.moveUp(...selected.value);
    },
    { key: ']', directions: '上移一层', exact: true, ctrlKey: true }
  );
  const moveBottom = useHotKey(
    () => {
      app.moveBottom(...selected.value);
    },
    { key: '[', directions: '置于底层', exact: true, ctrlKey: true, shiftKey: true }
  );
  const moveTop = useHotKey(
    () => {
      app.moveTop(...selected.value);
    },
    { key: ']', directions: '置于顶层', exact: true, ctrlKey: true, shiftKey: true }
  );
  const deleteNode = useHotKey(
    () => {
      app.remove(...selected.value);
    },
    { key: ['delete', 'backspace'], directions: '删除' }
  );
  const selectAll = useHotKey(
    () => {
      app.selectAll();
    },
    { key: 'a', directions: '全部选中', exact: true, ctrlKey: true }
  );
  const resetStage = useHotKey(
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
    { key: 'r', directions: '重置画布', exact: true, ctrlKey: true }
  );
  const undo = useHotKey(
    () => {
      app.undo();
    },
    { key: 'z', directions: '撤销', exact: true, ctrlKey: true }
  );
  const redo = useHotKey(
    () => {
      app.redo();
    },
    { key: 'y', directions: '重做', exact: true, ctrlKey: true }
  );
  const stageDrag = useHotKey(
    () => {
      app.triggerPanning(true);
      return () => {
        app.triggerPanning(false);
      };
    },
    { key: ' ', directions: '移动画布' }
  );
  const mouseWheel = useHotKey(
    () => {
      app.triggerMouseWheel(true);
      return () => {
        app.triggerMouseWheel(false);
      };
    },
    { key: ['Control', 'Meta'], directions: '缩放画布' }
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
    mouseWheel,
  };
};

export default useBindHotKey;
