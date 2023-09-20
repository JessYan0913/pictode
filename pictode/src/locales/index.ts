import { createI18n } from 'vue-i18n';

import en from './languages/en';
import zhCN from './languages/zh-CN';
import zhTW from './languages/zh-TW';

export const languages = [
  { label: '简体中文', value: 'zh-CN', message: zhCN },
  { label: '繁体中文', value: 'zh-TW', message: zhTW },
  { label: 'English', value: 'en', message: en },
];

export const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  messages: languages.reduce((messages, { value, message }) => ({ ...messages, [value]: message }), {}),
});

export const t = i18n.global.t;

export default i18n;
