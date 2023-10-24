import { MaybeRef, provide, reactive, unref, watch, watchEffect } from 'vue';

import { OSContextKey } from '../constants/inject-keys';
import { BrowserInfo, Geolocation, OperatingSystem, OSContext } from '../types';

import useMedia from './useMedia';

const getOperatingSystem = (): OperatingSystem => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('mac')) {
    return 'macOS';
  } else if (userAgent.includes('win')) {
    return 'Windows';
  } else if (/android/.test(userAgent)) {
    return 'Android';
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iOS';
  } else if (/linux/.test(userAgent)) {
    return 'Linux';
  } else if (/bsd/.test(userAgent)) {
    return 'BSD';
  } else {
    return 'Unknown';
  }
};

const getOperatingSystemVersion = (): string => {
  const userAgent = navigator.userAgent;
  let osVersion = 'Unknown';

  if (/Windows NT/.test(userAgent)) {
    const match = RegExp(/Windows NT (\d+\.\d+)/).exec(userAgent);
    if (match) {
      osVersion = match[1];
    }
  } else if (/Mac OS X/.test(userAgent)) {
    const match = RegExp(/Mac OS X (\d+_\d+)/).exec(userAgent);
    if (match) {
      osVersion = match[1].replace('_', '.');
    }
  } else if (/Android/.test(userAgent)) {
    const match = RegExp(/Android (\d+\.\d+)/).exec(userAgent);
    if (match) {
      osVersion = match[1];
    }
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    const match = RegExp(/OS (\d+_\d+)/).exec(userAgent);
    if (match) {
      osVersion = match[1].replace('_', '.');
    }
  }

  return osVersion;
};

const getBrowserInfo = (): BrowserInfo => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/chrome/.test(userAgent)) {
    return 'Chrome';
  } else if (/firefox/.test(userAgent)) {
    return 'Firefox';
  } else if (/safari/.test(userAgent)) {
    return 'Safari';
  } else if (/edge/.test(userAgent)) {
    return 'Edge';
  } else if (/msie|trident/.test(userAgent)) {
    return 'Internet Explorer';
  } else {
    return 'Unknown';
  }
};

const getBrowserVersion = (): string => {
  const userAgent = navigator.userAgent;
  let browserVersion = 'Unknown';

  if (/Chrome/.test(userAgent)) {
    const match = RegExp(/Chrome\/(\d+\.\d+)/).exec(userAgent);
    if (match) {
      browserVersion = match[1];
    }
  } else if (/Firefox/.test(userAgent)) {
    const match = RegExp(/Firefox\/(\d+\.\d+)/).exec(userAgent);
    if (match) {
      browserVersion = match[1];
    }
  } else if (/Safari/.test(userAgent)) {
    const match = RegExp(/Version\/(\d+\.\d+)/).exec(userAgent);
    if (match) {
      browserVersion = match[1];
    }
  } else if (/Edge/.test(userAgent)) {
    const match = RegExp(/Edge\/(\d+\.\d+)/).exec(userAgent);
    if (match) {
      browserVersion = match[1];
    }
  } else if (/MSIE|Trident/.test(userAgent)) {
    const match = RegExp(/(?:MSIE|rv:)(\d+\.\d+)/).exec(userAgent);
    if (match) {
      browserVersion = match[1];
    }
  }

  return browserVersion;
};

const getUserGeolocation = (): Promise<Geolocation> => {
  if ('geolocation' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  } else {
    return Promise.reject(new Error('Geolocation is not available.'));
  }
};

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
    }
  );
  provide(OSContextKey, osContext);
  return osContext;
};

export default useOSContext;
