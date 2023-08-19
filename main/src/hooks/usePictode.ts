import { ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { getPanelConfigByShape, PanelConfig } from '@/panels';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
const panelConfig = ref<PanelConfig>();

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
  panelConfig.value = getPanelConfigByShape(newSelected[0]?.className ?? '');
});

export const usePictode = () => {
  return {
    app,
    selected,
    panelConfig,
  };
};

export default usePictode;
