import { InjectionKey } from 'vue';

import { OSContext } from '../types';

export const OSContextKey: InjectionKey<OSContext> = Symbol('OSContext');
