import { InjectionKey } from 'vue';

import { FormState } from '@/form/types';

export const FormStateKey: InjectionKey<FormState> = Symbol('FORM_STATE');
