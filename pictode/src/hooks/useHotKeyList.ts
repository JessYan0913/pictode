import { provide, Ref } from 'vue';
import { App, Konva, KonvaNode } from '@pictode/core';
import { injectWithSelf, useCommandComponent, useHotKey } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';
import { PictodeHotKeyListKey } from '@/constants/inject-key';

export const useHotKeyList = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const existingHotKeyList = injectWithSelf(PictodeHotKeyListKey, null);
  if (existingHotKeyList) {
    return existingHotKeyList;
  }

  const messageBox = useCommandComponent(MessageBox);
  const resolve = {
    moveDown: useHotKey(
      () => {
        app.moveDown(...selected.value);
      },
      { key: '[', directions: '下移一层', exact: true, ctrlKey: true }
    ),
    moveUp: useHotKey(
      () => {
        app.moveUp(...selected.value);
      },
      { key: ']', directions: '上移一层', exact: true, ctrlKey: true }
    ),
    moveBottom: useHotKey(
      () => {
        app.moveBottom(...selected.value);
      },
      { key: '[', directions: '置于底层', exact: true, ctrlKey: true, shiftKey: true }
    ),
    moveTop: useHotKey(
      () => {
        app.moveTop(...selected.value);
      },
      { key: ']', directions: '置于顶层', exact: true, ctrlKey: true, shiftKey: true }
    ),
    deleteNode: useHotKey(
      () => {
        app.remove(...selected.value);
      },
      { key: ['delete', 'backspace'], directions: '删除' }
    ),
    selectAll: useHotKey(
      () => {
        const originEnabled = app.isPluginEnable('selectorPlugin');
        app.triggerSelector(true);
        app.selectAll();
        app.triggerSelector(originEnabled);
      },
      { key: 'a', directions: '全部选中', exact: true, ctrlKey: true }
    ),
    resetStage: useHotKey(
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
    ),
    undo: useHotKey(
      () => {
        app.undo();
      },
      { key: 'z', directions: '撤销', exact: true, ctrlKey: true }
    ),
    redo: useHotKey(
      () => {
        app.redo();
      },
      { key: 'y', directions: '重做', exact: true, ctrlKey: true }
    ),
    stageDrag: useHotKey(
      () => {
        app.triggerPanning(true);
        return () => {
          app.triggerPanning(false);
        };
      },
      { key: ' ', directions: '移动画布' }
    ),
    mouseWheel: useHotKey(
      () => {
        app.triggerMouseWheel(true);
        return () => {
          app.triggerMouseWheel(false);
        };
      },
      { key: ['Control', 'Meta'], directions: '缩放画布' }
    ),
    makeGroup: useHotKey(
      () => {
        const group = app.makeGroup(selected.value);
        if (Array.isArray(group)) {
          return;
        }
        app.select(group);
      },
      { key: 'g', directions: '组合', ctrlKey: true, shiftKey: true, exact: true }
    ),
    decomposeGroup: useHotKey(
      () => {
        const selectedNode = selected.value[0];
        if (selectedNode instanceof Konva.Group) {
          app.decomposeGroup(selectedNode);
        }
      },
      { key: 'j', directions: '解除组合', ctrlKey: true, shiftKey: true, exact: true }
    ),
  };
  provide(PictodeHotKeyListKey, resolve);

  return resolve;
};

export default useHotKeyList;
