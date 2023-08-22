import { InjectionKey, Ref } from 'vue';

import { FormState } from '@/form/types';

export const FormStateKey: InjectionKey<FormState> = Symbol('FORM_STATE');

export const SelectedLabelKey: InjectionKey<Ref<string | number | undefined>> = Symbol('SELECTED_LABEL');
