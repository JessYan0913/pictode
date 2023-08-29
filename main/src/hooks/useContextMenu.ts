import { onMounted, onUnmounted, Ref } from 'vue';
import { App, EventArgs, Konva, KonvaNode } from '@pictode/core';
import { useCommandComponent } from '@pictode/vue-aide';

import ContextMenu from '@/components/ContextMenu.vue';

import useBindHotKey from './useHotKeyList';

export const useContextMenu = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const contextMenu = useCommandComponent(ContextMenu);
  const { moveDown, moveUp, moveBottom, moveTop, deleteNode, selectAll, resetStage, undo, redo } = useBindHotKey(
    app,
    selected
  );
  const onContextmenu = ({ event }: EventArgs['mouse:contextmenu']) => {
    event.evt.preventDefault();
    const targetIsStage = event.target instanceof Konva.Stage;
    const shapeLayerMenus =
      selected.value.length && !targetIsStage
        ? [
            {
              label: moveDown.directions,
              hotKey: moveDown.hotKey,
              action: moveDown.onKeyPressed,
            },
            {
              label: moveUp.directions,
              hotKey: moveUp.hotKey,
              action: moveUp.onKeyPressed,
            },
            {
              label: moveBottom.directions,
              hotKey: moveBottom.hotKey,
              action: moveBottom.onKeyPressed,
            },
            {
              label: moveTop.directions,
              hotKey: moveTop.hotKey,
              action: moveTop.onKeyPressed,
            },
          ]
        : [];
    const shapeDeleteMenus =
      selected.value.length && !targetIsStage
        ? [
            {
              label: deleteNode.directions,
              hotKey: deleteNode.hotKey,
              action: deleteNode.onKeyPressed,
            },
          ]
        : [];
    const stageMenus =
      targetIsStage || selected.value.length === 0
        ? [
            {
              label: selectAll.directions,
              hotKey: selectAll.hotKey,
              action: selectAll.onKeyPressed,
            },
            {
              label: resetStage.directions,
              hotKey: resetStage.hotKey,
              action: resetStage.onKeyPressed,
            },
          ]
        : [];
    const historyMenus = [
      {
        label: undo.directions,
        hotKey: undo.hotKey,
        disable: !app.canUndo(),
        action: undo.onKeyPressed,
      },
      {
        label: redo.directions,
        hotKey: redo.hotKey,
        disable: !app.canRedo(),
        action: redo.onKeyPressed,
      },
    ];
    const menuGroups = [stageMenus, shapeLayerMenus, historyMenus, shapeDeleteMenus];

    contextMenu({
      x: event.evt.clientX,
      y: event.evt.clientY,
      menuGroups,
    });
  };

  onMounted(() => app.on('mouse:contextmenu', onContextmenu));

  onUnmounted(() => app.off('mouse:contextmenu', onContextmenu));
};

export default useContextMenu;
