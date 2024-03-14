import { BrowserInfo, Geolocation, OperatingSystem } from '@pictode/utils';

export interface OSContext {
  OS: OperatingSystem;
  OSVersion: string;
  OSTheme: 'Dark' | 'Light';
  browser: BrowserInfo;
  browserVersion: string;
  online: boolean;
  language: string;
  geolocation: null | Geolocation;
  timeZone: string;
}

export interface HotKeyInfo {
  hotKey: (string | string[])[];
  directions?: string;
  onKeyPressed: () => void;
}
