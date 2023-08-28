import { Ref, ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import HistoryPlugin from '@pictode/plugin-history';
import SelectorPlugin from '@pictode/plugin-selector';

import { FormConfig, FormValue } from '@/form';
import { getPanelConfigByShape, getPanelConfigByTool } from '@/panels';

const app = new App();

const historyPlugin = new HistoryPlugin({
  enable: true,
  stackSize: 50,
});

const selectorPlugin = new SelectorPlugin({
  enable: true,
  multipleSelect: true,
});

app.use(historyPlugin);
app.use(selectorPlugin);

const selected: Ref<Array<KonvaNode>> = ref([]);
const panelFormConfig = ref<FormConfig>([]);
const panelFormModel = ref<FormValue>({});

app.on('selected:changed', ({ selected: newSelected }) => {
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
});

app.on('tool:changed', ({ curTool }) => {
  const newPanelConfig = getPanelConfigByTool(curTool.name);
  if (!newPanelConfig) {
    return;
  }
  panelFormConfig.value = newPanelConfig.formConfig;
  panelFormModel.value = newPanelConfig.model;
  curTool.config = panelFormModel.value;
});

export const usePictode = () => {
  return {
    app,
    selected,
    panelFormConfig,
    panelFormModel,
  };
};

export default usePictode;
