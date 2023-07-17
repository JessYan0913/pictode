import { EnvironmentError, FileSelectCancelError, IllegalFileError } from './error';

/**
 * 获取文件后缀
 *
 * @param file 文件或文件名
 * @returns
 */
export const getFileExtension = (file: File | string): string => {
  let fileName: string;
  if (file instanceof File) {
    fileName = file.name;
  } else {
    fileName = file;
  }
  return fileName.match(/\.([0-9a-z]+)(?:[\\?#]|$)/i)![1] ?? '';
};

/**
 * 选择系统文件
 *
 * @param accepts 可选文件后缀
 * @param multiple 是否多选
 * @returns
 */
export const selectFile = (accepts: string[] = ['*'], multiple?: boolean): Promise<File[]> => {
  if (!globalThis.document || !(globalThis.document instanceof Document)) {
    throw new EnvironmentError();
  }
  const inputElement = globalThis.document.createElement('input');
  inputElement.setAttribute('type', 'file');
  inputElement.setAttribute('visibility', 'hidden');
  if (Array.isArray(accepts) && accepts.length > 0) {
    inputElement.setAttribute('accept', accepts.join(','));
  }
  if (multiple) {
    inputElement.setAttribute('multiple', 'true');
  }
  inputElement.click();

  return new Promise((resolve, reject) => {
    globalThis.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!inputElement.files || inputElement.files?.length === 0) {
            reject(new FileSelectCancelError());
          }
        }, 1000);
      },
      { once: true }
    );
    inputElement.addEventListener('change', () => {
      if (!inputElement.files || inputElement.files?.length === 0) {
        reject(new FileSelectCancelError());
      } else {
        const files = Array.from(inputElement.files);
        if (illegalFiles(files)) {
          reject(new IllegalFileError(accepts));
        }
        resolve(files);
      }
    });
  });

  function illegalFiles(files: File[]): boolean {
    return !accepts.includes('*') && files.some((file) => !accepts.includes(`.${getFileExtension(file)}`));
  }
};

export const isImage = (file: File): boolean => {
  return /^image\//.test(file.type);
};

export const isVideo = (file: File): boolean => {
  return /^video\//.test(file.type);
};

export const isAudio = (file: File): boolean => {
  return /^audio\//.test(file.type);
};

export const isWordDocument = (file: File): boolean => {
  return /^application\/(?:vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword|vnd\.ms-word\.document\.macroenabled\.12|vnd\.openxmlformats-officedocument\.wordprocessingml\.template|vnd\.ms-word\.template\.macroenabled\.12)$/.test(
    file.type
  );
};

export const isExcelDocument = (file: File): boolean => {
  return /^application\/(?:vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-excel|vnd\.ms-excel\.sheet\.macroenabled\.12|vnd\.openxmlformats-officedocument\.spreadsheetml\.template|vnd\.ms-excel\.template\.macroenabled\.12)$/.test(
    file.type
  );
};

export const isPowerPointDocument = (file: File): boolean => {
  return /^application\/(?:vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation|vnd\.ms-powerpoint\.presentation\.macroenabled\.12|vnd\.openxmlformats-officedocument\.presentationml\.template|vnd\.ms-powerpoint\.template\.macroenabled\.12)$/.test(
    file.type
  );
};

export const isJsonDocument = (file: File): boolean => {
  return /^application\/json$/.test(file.type);
};

export const isXmlDocument = (file: File): boolean => {
  return /^(?:application|text)\/(?:xml|xhtml\+xml)$/.test(file.type);
};

export interface FileHandler {
  (fileRender: FileReader): void;
}

export const readeFile = <T extends string | ArrayBuffer | null>(fileHandler: FileHandler): Promise<T> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('progress', (event: FileReaderEventMap['progress']) => {
      const size = '(' + Math.floor(event.total / 1000) + ' KB)';
      const progress = Math.floor((event.loaded / event.total) * 100) + '%';

      console.log(`Loading size: ${size} progress: ${progress}`);
    });

    reader.addEventListener('load', (event: FileReaderEventMap['load']) => {
      resolve(event.target?.result as T);
    });

    reader.addEventListener('error', (event: FileReaderEventMap['error']) => {
      reject(event);
    });

    fileHandler(reader);
  });
};
