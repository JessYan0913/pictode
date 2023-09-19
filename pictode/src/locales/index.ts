import { createI18n } from 'vue-i18n';

import en from './languages/en';
import zhCN from './languages/zh-CN';
import zhTW from './languages/zh-TW';

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  messages: {
    en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
  },
});

export const t = i18n.global.t;

export default i18n;
