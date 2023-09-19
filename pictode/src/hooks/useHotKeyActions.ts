import { provide, Ref } from 'vue';
import { App, Konva, KonvaNode } from '@pictode/core';
import { injectWithSelf, useCommandComponent, useHotKey } from '@pictode/vue-aide';

import MessageBox from '@/components/MessageBox.vue';
import { PictodeHotKeyActionsKey } from '@/constants/inject-key';
import useReadFileContent from '@/hooks/useReadFileContent';

export const useHotKeyActions = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const existingHotKeyList = injectWithSelf(PictodeHotKeyActionsKey, null);
  if (existingHotKeyList) {
    return existingHotKeyList;
  }

  const messageBox = useCommandComponent(MessageBox);
  const { execute: readFileContent } = useReadFileContent();
  const resolve = {
    open: useHotKey(
      async () => {
        const result = await readFileContent(['.pictode']);
        result && app.fromJSON(result);
      },
      { key: 'o', directions: '打开', exact: true, ctrlKey: true }
    ),
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
    alignLeft: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignLeft(selected.value);
      },
      { key: 'a', directions: '左对齐', shiftKey: true }
    ),
    alignCenterX: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignCenterX(selected.value);
      },
      { key: 'h', directions: '水平居中', shiftKey: true }
    ),
    alignRight: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignRight(selected.value);
      },
      { key: 'd', directions: '右对齐', shiftKey: true }
    ),
    alignTop: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignTop(selected.value);
      },
      { key: 'w', directions: '顶对齐', shiftKey: true }
    ),
    alignCenterY: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignCenterY(selected.value);
      },
      { key: 'v', directions: '垂直居中', shiftKey: true }
    ),
    alignBottom: useHotKey(
      () => {
        if (selected.value.length < 1) {
          return;
        }
        app.alignBottom(selected.value);
      },
      { key: 's', directions: '底对齐', shiftKey: true }
    ),
    distributeX: useHotKey(
      () => {
        if (selected.value.length < 2) {
          return;
        }
        app.dispersionX(selected.value);
      },
      { key: 'h', directions: '水平分布', ctrlKey: true, shiftKey: true }
    ),
    distributeY: useHotKey(
      () => {
        if (selected.value.length < 2) {
          return;
        }
        app.dispersionY(selected.value);
      },
      { key: 'v', directions: '垂直分布', ctrlKey: true, shiftKey: true }
    ),
  };
  provide(PictodeHotKeyActionsKey, resolve);

  return resolve;
};

export default useHotKeyActions;
