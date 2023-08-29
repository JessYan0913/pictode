import { InjectionKey, Ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import HistoryPlugin from '@pictode/plugin-history';
import SelectorPlugin from '@pictode/plugin-selector';

import { FormConfig, FormState, FormValue } from '@/form/types';

export const FormStateKey: InjectionKey<FormState> = Symbol('FORM_STATE');

export const PictodeAppKey: InjectionKey<App> = Symbol('PictodeAppKey');

export const PictodePluginsKey: InjectionKey<{ selectorPlugin: SelectorPlugin; historyPlugin: HistoryPlugin }> =
  Symbol('PictodePluginKey');

export const PictodeSelectedKey: InjectionKey<Ref<Array<KonvaNode>>> = Symbol('PictodeSelectedKey');

export const PictodePanelFormKey: InjectionKey<{ panelFormConfig: Ref<FormConfig>; panelFormModel: Ref<FormValue> }> =
  Symbol('PictodePanelFormKey');
