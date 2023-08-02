import { AppConfig } from '../types';

export * from './math';

export { guid, readeFile, selectFile } from '@pictode/utils';

export const DEFAULT_APP_CONFIG: AppConfig = {
  backgroundColor: '#ffffff',
};
