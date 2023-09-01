import { onMounted, onUnmounted, Ref } from 'vue';
import { App, EventArgs, Konva, KonvaNode } from '@pictode/core';
import { useCommandComponent } from '@pictode/vue-aide';

import ContextMenu from '@/components/ContextMenu.vue';

import useBindHotKey from './useHotKeyList';

const hotKeyFactory = (keys: (string | string[])[]): string => {
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function processItem(item: string | string[]) {
    if (typeof item === 'string') {
      return capitalize(item);
    } else if (Array.isArray(item)) {
      return item.map((subItem) => capitalize(subItem)).join('/');
    }
  }

  if (Array.isArray(keys)) {
    return keys.map((item) => processItem(item)).join('+');
  }

  return capitalize(keys);
};

export const useContextMenu = (app: App, selected: Ref<Array<KonvaNode>>) => {
  const contextMenu = useCommandComponent(ContextMenu);
  const { moveDown, moveUp, moveBottom, moveTop, deleteNode, selectAll, resetStage, undo, redo } = useBindHotKey(
    app,
    selected
  );
  const onContextmenu = ({ event }: EventArgs['mouse:contextmenu']) => {
    event.evt.preventDefault();
    let targetIsStage = false;
    if (event.target instanceof Konva.Stage) {
      targetIsStage = true;
    } else if (!selected.value.find((node) => node.id() === event.target.id())) {
      if (event.target.parent instanceof Konva.Group) {
        app.select(event.target.parent);
      } else {
        app.select(event.target);
      }
    }
    const shapeLayerMenus =
      selected.value.length && !targetIsStage
        ? [
            {
              label: moveDown.directions,
              hotKey: hotKeyFactory(moveDown.hotKey),
              action: moveDown.onKeyPressed,
            },
            {
              label: moveUp.directions,
              hotKey: hotKeyFactory(moveUp.hotKey),
              action: moveUp.onKeyPressed,
            },
            {
              label: moveBottom.directions,
              hotKey: hotKeyFactory(moveBottom.hotKey),
              action: moveBottom.onKeyPressed,
            },
            {
              label: moveTop.directions,
              hotKey: hotKeyFactory(moveTop.hotKey),
              action: moveTop.onKeyPressed,
            },
          ]
        : [];
    const groupMenus =
      selected.value.length > 1 && !targetIsStage
        ? [
            {
              label: '组合',
              hotKey: '',
              action: () => {
                app.makeGroup(...selected.value);
              },
            },
          ]
        : [];
    const removeGroupMenus =
      selected.value.length === 1 && selected.value[0] instanceof Konva.Group
        ? [
            {
              label: '解除组合',
              hotKey: '',
              action: () => {
                app.decomposeGroup(selected.value[0] as Konva.Group);
              },
            },
          ]
        : [];
    const shapeDeleteMenus =
      selected.value.length && !targetIsStage
        ? [
            {
              label: deleteNode.directions,
              hotKey: hotKeyFactory(deleteNode.hotKey),
              action: deleteNode.onKeyPressed,
            },
          ]
        : [];
    const stageMenus =
      targetIsStage || selected.value.length === 0
        ? [
            {
              label: selectAll.directions,
              hotKey: hotKeyFactory(selectAll.hotKey),
              action: selectAll.onKeyPressed,
            },
            {
              label: resetStage.directions,
              hotKey: hotKeyFactory(resetStage.hotKey),
              action: resetStage.onKeyPressed,
            },
          ]
        : [];
    const historyMenus = [
      {
        label: undo.directions,
        hotKey: hotKeyFactory(undo.hotKey),
        disable: !app.canUndo(),
        action: undo.onKeyPressed,
      },
      {
        label: redo.directions,
        hotKey: hotKeyFactory(redo.hotKey),
        disable: !app.canRedo(),
        action: redo.onKeyPressed,
      },
    ];
    const menuGroups = [stageMenus, shapeLayerMenus, groupMenus, removeGroupMenus, historyMenus, shapeDeleteMenus];

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
