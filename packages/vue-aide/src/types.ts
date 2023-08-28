export type OperatingSystem = 'macOS' | 'Windows' | 'Android' | 'iOS' | 'Linux' | 'BSD' | 'Unknown';

export type BrowserInfo = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Internet Explorer' | 'Unknown';

export interface Geolocation {
  latitude: number;
  longitude: number;
}

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
