import { onMounted, onUnmounted, provide, Ref, ref } from 'vue';
import { App, EventArgs, KonvaNode } from '@pictode/core';
import AlignmentPlugin from '@pictode/plugin-alignment';
import HistoryPlugin from '@pictode/plugin-history';
import SelectorPlugin from '@pictode/plugin-selector';

import { PictodeAppKey, PictodePanelFormKey, PictodePluginsKey, PictodeSelectedKey } from '@/constants/inject-key';
import { FormConfig, FormValue } from '@/form';
import { getPanelConfigByShape, getPanelConfigByTool } from '@/panels';

export const usePictode = () => {
  const app = new App();

  const historyPlugin = new HistoryPlugin({
    enabled: true,
    stackSize: 50,
  });

  const selectorPlugin = new SelectorPlugin({
    enabled: true,
    multipleSelect: true,
  });

  const alignmentPlugin = new AlignmentPlugin({
    enabled: true,
  });

  app.use(historyPlugin);
  app.use(selectorPlugin);
  app.use(alignmentPlugin);

  app.on('mouse:down', ({ event }) => {
    if (event.evt.button === 1) {
      app.triggerPanning(true);
    }
  });
  app.on('mouse:up', ({ event }) => {
    if (event.evt.button === 1) {
      app.triggerPanning(false);
    }
  });

  const selected: Ref<Array<KonvaNode>> = ref([]);
  const panelFormConfig = ref<FormConfig>([]);
  const panelFormModel = ref<FormValue>({});
  const scale = ref<number>(app.scale());

  const onSelectedChanged = ({ selected: newSelected }: EventArgs['selected:changed']) => {
    selected.value = newSelected;
    if (app.curTool?.name !== 'selectTool') {
      return;
    }
    const newPanelConfig = getPanelConfigByShape(newSelected[0]?.className ?? '');
    panelFormConfig.value = newPanelConfig?.formConfig ?? [];
    if (newPanelConfig?.model) {
      newPanelConfig.model = Object.keys(newPanelConfig.model).reduce(
        (model, key) => ({
          ...model,
          [key]: selected.value?.[0].attrs[key],
        }),
        {}
      );
    }
    panelFormModel.value = newPanelConfig?.model ?? {};
  };

  const onToolChanged = ({ curTool }: EventArgs['tool:changed']) => {
    if (!curTool) {
      return;
    }
    const newPanelConfig = getPanelConfigByTool(curTool.name);
    if (!newPanelConfig) {
      return;
    }
    panelFormConfig.value = newPanelConfig.formConfig;
    panelFormModel.value = newPanelConfig.model;
    curTool.config = { ...curTool.config, ...panelFormModel.value };
  };

  const onZoomEnd = ({ scale: newScale }: EventArgs['canvas:zoom:end']) => {
    scale.value = newScale;
  };

  onMounted(() => {
    app.on('selected:changed', onSelectedChanged);
    app.on('tool:changed', onToolChanged);
    app.on('canvas:zoom:end', onZoomEnd);
  });

  onUnmounted(() => {
    app.off('selected:changed', onSelectedChanged);
    app.off('tool:changed', onToolChanged);
    app.off('canvas:zoom:end', onZoomEnd);
  });

  provide(PictodeAppKey, app);
  provide(PictodeSelectedKey, selected);
  provide(PictodePluginsKey, { selectorPlugin, historyPlugin });
  provide(PictodePanelFormKey, { panelFormConfig, panelFormModel });
  return {
    app,
    scale,
    selected,
    panelFormConfig,
    panelFormModel,
  };
};

export default usePictode;
