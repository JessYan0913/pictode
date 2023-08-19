import { ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { FormValue } from '@/form';
import { getPanelConfig, PanelConfig } from '@/panels';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
const panelConfig = ref<PanelConfig>();
const panelValue = ref<FormValue>({
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
  cornerRadius: 10,
  opacity: 1,
  fontSize: 16,
});

const handlePanelConfigChange = () => {
  panelConfig.value = getPanelConfig(app);
};

app.on('selected:changed', ({ selected: newSelected }) => {
  handlePanelConfigChange();
  selected.value = newSelected;
});

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
