import { ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { FormConfig, FormValue } from '@/form';
import { getPanelConfigByShape } from '@/panels';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
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

export const usePictode = () => {
  return {
    app,
    selected,
    panelFormConfig,
    panelFormModel,
  };
};

export default usePictode;
