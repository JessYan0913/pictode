import { ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { FormConfig, FormValue } from '@/form';
import { getPanelConfig } from '@/panels';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
const panelConfig = ref<FormConfig>([]);
const panelValue = ref<FormValue>({
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
  cornerRadius: 10,
  opacity: 1,
  fontSize: 16,
});

const handlePanelConfigChange = () => {
  const panel = getPanelConfig(app);
  if (!panel) {
    return;
  }
  panelConfig.value = panel.formConfig;
  console.log('=====>', panelConfig);
};

app.on('selected:changed', handlePanelConfigChange);

app.on('tool:changed', handlePanelConfigChange);

export const usePictode = () => {
  return {
    app,
    selected,
    panelConfig,
    panelValue,
  };
};

export default usePictode;
