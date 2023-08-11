import { Plugin } from 'vue';

import RadioGroup from './fields/RadioGroup.vue';

export { default as Form } from './Form.vue';
export * from './types';

export const formPlugin: Plugin = {
  install(app) {
    app.component('RadioGroup', RadioGroup);
  },
};

export default formPlugin;
