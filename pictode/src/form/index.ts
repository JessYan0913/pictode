import { Plugin } from 'vue';

import Color from './fields/Color.vue';
import RadioGroup from './fields/RadioGroup.vue';
import Slider from './fields/Slider.vue';
import Texts from './fields/Texts.vue';

export { default as Form } from './Form.vue';
export * from './types';

export const formPlugin: Plugin = {
  install(app) {
    app.component('Texts', Texts);
    app.component('RadioGroup', RadioGroup);
    app.component('Color', Color);
    app.component('Slider', Slider);
  },
};

export default formPlugin;
