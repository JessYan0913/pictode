import { InjectionKey, Ref } from 'vue';
import { App, KonvaNode } from '@pictode/core';
import HistoryPlugin from '@pictode/plugin-history';
import SelectorPlugin from '@pictode/plugin-selector';
import { HotKeyFunction } from '@pictode/vue-aide';

import { FormConfig, FormState, FormValue } from '@/form/types';

export const FormStateKey: InjectionKey<FormState> = Symbol('FORM_STATE');

export const PictodeAppKey: InjectionKey<App> = Symbol('PictodeAppKey');

export const PictodePluginsKey: InjectionKey<{ selectorPlugin: SelectorPlugin; historyPlugin: HistoryPlugin }> =
  Symbol('PictodePluginKey');

export const PictodeSelectedKey: InjectionKey<Ref<Array<KonvaNode>>> = Symbol('PictodeSelectedKey');

export const PictodePanelFormKey: InjectionKey<{ panelFormConfig: Ref<FormConfig>; panelFormModel: Ref<FormValue> }> =
  Symbol('PictodePanelFormKey');

export const PictodeHotKeyActionsKey: InjectionKey<{
  open: HotKeyFunction;
  moveDown: HotKeyFunction;
  moveUp: HotKeyFunction;
  moveBottom: HotKeyFunction;
  moveTop: HotKeyFunction;
  deleteNode: HotKeyFunction;
  selectAll: HotKeyFunction;
  resetStage: HotKeyFunction;
  undo: HotKeyFunction;
  redo: HotKeyFunction;
  stageDrag: HotKeyFunction;
  mouseWheel: HotKeyFunction;
  makeGroup: HotKeyFunction;
  decomposeGroup: HotKeyFunction;
  alignLeft: HotKeyFunction;
  alignCenterX: HotKeyFunction;
  alignRight: HotKeyFunction;
  alignTop: HotKeyFunction;
  alignCenterY: HotKeyFunction;
  alignBottom: HotKeyFunction;
  distributeX: HotKeyFunction;
  distributeY: HotKeyFunction;
}> = Symbol('PictodeHotKeyListKey');
