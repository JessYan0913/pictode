import { MaybeRef, provide, reactive, unref, watch, watchEffect } from 'vue';
import {
  getBrowserInfo,
  getBrowserVersion,
  getOperatingSystem,
  getOperatingSystemVersion,
  getUserGeolocation,
} from '@pictode/utils';

import { OSContextKey } from '../constants/inject-keys';
import { OSContext } from '../types';

import useMedia from './useMedia';

export const useOSContext = (needLocation: MaybeRef<boolean> = false) => {
  const isDarkModel = useMedia('(prefers-color-scheme: dark)');
  const osContext = reactive<OSContext>({
    OS: getOperatingSystem(),
    OSVersion: getOperatingSystemVersion(),
    OSTheme: isDarkModel ? 'Dark' : 'Light',
    browser: getBrowserInfo(),
    browserVersion: getBrowserVersion(),
    online: navigator.onLine,
    language: navigator.language,
    geolocation: null,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  watchEffect(() => {
    if (unref(needLocation)) {
      getUserGeolocation()
        .then((geoInfo) => {
          osContext.geolocation = geoInfo;
        })
        .catch((error) => {
          console.error('Error getting geolocation:', error);
        });
    }
  });
  watch(
    () => isDarkModel.value,
    () => {
      osContext.OSTheme = isDarkModel.value ? 'Dark' : 'Light';
    },
  );
  provide(OSContextKey, osContext);
  return osContext;
};

export default useOSContext;
