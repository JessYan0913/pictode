import { reactive, ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { FormConfig, FormValue } from '@/form';
import { getPanelConfigByShape } from '@/panels';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
const panelConfig = reactive<{
  formConfig: FormConfig;
  formModel: FormValue;
}>({
  formConfig: [],
  formModel: {},
});

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
  const newPanelConfig = getPanelConfigByShape(newSelected[0]?.className ?? '');
  panelConfig.formConfig = newPanelConfig?.formConfig ?? [];
  panelConfig.formModel = newPanelConfig?.model ?? {};
});

export const usePictode = () => {
  return {
    app,
    selected,
    panelConfig,
  };
};

export default usePictode;
