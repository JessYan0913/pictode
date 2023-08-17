import { ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import { HistoryPlugin } from '@pictode/plugin-history';

import { FormConfig, FormValue } from '@/form';
import diamondForm from '@/panels/diamond-panel';
import ellipseForm from '@/panels/ellipse-panel';
import imageForm from '@/panels/image-panel';
import lineForm from '@/panels/line-panel';
import rectForm from '@/panels/rect-panel';
import textForm from '@/panels/text-panel';

const app = new App();
app.use(new HistoryPlugin());

const selected = ref<Array<KonvaNode>>([]);
const panelConfig = ref<FormConfig>([]);
const panelValue = ref<FormValue>({});

app.on('selected:changed', ({ selected: newSelected }) => {
  selected.value = newSelected;
  if (selected.value.length === 1) {
    panelValue.value = selected.value[0].toObject().attrs;
    switch (selected.value[0].className) {
      case 'Rect':
        panelConfig.value = rectForm;
        break;
      case 'Image':
        panelConfig.value = imageForm;
        break;
      case 'Line':
        panelConfig.value = lineForm;
        break;
      case 'Ellipse':
        panelConfig.value = ellipseForm;
        break;
      case 'RegularPolygon':
        panelConfig.value = diamondForm;
        break;
      case 'Text':
        panelConfig.value = textForm;
        break;
    }
  } else {
    panelConfig.value = [];
  }
});

export const usePictode = () => {
  return {
    app,
    selected,
    panelConfig,
    panelValue,
  };
};

export default usePictode;
