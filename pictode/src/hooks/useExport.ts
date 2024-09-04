import { ref } from 'vue';
import { BaseError } from '@pictode/utils';

import { MimeType } from '@/constants/mime-type';

class ExportError extends BaseError {
  constructor(fileName: string, e: any) {
    super(`${fileName} 导出失败`, { cause: e.cause });
  }
}

export type FileName<T> = string | ((data?: T) => string);

export const useExport = <T = Record<string | number | symbol, any>>(
  requestFunc: (data?: T) => string | Promise<string>,
  fileName: FileName<T> = 'file',
  mimeType: MimeType = MimeType.TEXT,
  charset: string = 'utf-8',
  isURL: boolean = false,
) => {
  const loading = ref<boolean>(false);

  const error = ref<ExportError>();

  const execute = async (data?: T): Promise<void> => {
    loading.value = true;
    if (typeof fileName === 'function') {
      fileName = fileName(data);
    }
    try {
      const res = await Promise.resolve(requestFunc(data));
      const link = document.createElement('a');
      if (isURL) {
        link.href = res;
      } else {
        const blob = new Blob([res], { type: `${mimeType};charset=${charset}` });
        link.href = window.URL.createObjectURL(blob);
      }
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (e) {
      error.value = new ExportError(fileName, e);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    execute,
    loading,
    error,
  };
};

export default useExport;
