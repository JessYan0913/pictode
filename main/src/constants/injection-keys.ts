import { InjectionKey } from 'vue';

import { RadioCtx } from '@/types';

export const RadioCtxKey: InjectionKey<RadioCtx<unknown>> = Symbol('RadioCtx');
