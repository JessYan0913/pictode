import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia';
import piniaPresistedState from 'pinia-plugin-persistedstate';

import App from '@/App.vue';
import router from '@/router';

import 'virtual:svg-icons-register';

import 'element-plus/theme-chalk/index.css';
import './assets/styles/index.scss';

const pinia = createPinia();
pinia.use(piniaPresistedState);

const app = createApp(App);
app.use(ElementPlus, { locale: zhCn });
app.use(pinia);
app.use(router);
app.mount('#app');
