import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';

import formPlugin from './form';
import i18n from './locales';

import 'tailwindcss/tailwind.css';
import './assets/styles/index.css';

const app = createApp(App);
app.use(router);
app.use(formPlugin);
app.use(i18n);
app.mount('#app');
