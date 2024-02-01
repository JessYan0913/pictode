import { Plugin } from 'vue';

import CodeEditor from './fields/CodeEditor.vue';
import Color from './fields/Color.vue';
import RadioGroup from './fields/RadioGroup.vue';
import Slider from './fields/Slider.vue';

export { default as Form } from './Form.vue';
export * from './types';

export const formPlugin: Plugin = {
  install(app) {
    app.component('RadioGroup', RadioGroup);
    app.component('Color', Color);
    app.component('Slider', Slider);
    app.component('CodeEditor', CodeEditor);
  },
};

export default formPlugin;
