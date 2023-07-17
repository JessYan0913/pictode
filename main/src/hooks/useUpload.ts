import { ref } from 'vue';
import { BaseError } from '@tmp/utils';
import Crypto from 'crypto-js';

export class UploadError extends BaseError {
  constructor(fileName: string, cause?: any) {
    super(`${fileName}上传失败`, cause);
  }
}

export interface FileChunk {
  fileName: string;
  fileType: string;
  fileChunk: Blob;
  chunkIndex: number;
  chunkSize: number;
  chunkCount: number;
}

export interface FileReadResult {
  fileChunks: FileChunk[];
  md5: string;
  uid: string;
}

export interface UploadFileParams {
  fileChunk: Blob;
  fileName: string;
  fileType: string;
  chunkIndex: number;
  chunkCount: number;
  uid: string;
}

export interface UploadResult {
  progress: number;
  [key: string]: any;
}

export interface UploadConfirmParams {
  fileName: string;
  fileType: string;
  uid: string;
  md5: string;
}

export interface UploadConfirmResult {
  progress: number;
  contentUrl: string;
  [key: string]: any;
}

export interface FailureHandlerParams {
  fileName: string;
  fileType: string;
  uid: string;
  md5: string;
}

export interface UploadConfig {
  uploadFile: (params: UploadFileParams) => Promise<UploadResult>;
  uploadConfirm: (params: UploadConfirmParams) => Promise<UploadConfirmResult>;
  failureHandler: (params: FailureHandlerParams) => Promise<void>;
}

const chunkSize = 1024 * 1024 * 5;
async function readFile(file: File | Blob, fileName: string, fileType: string): Promise<FileReadResult> {
  const fileChunks: FileChunk[] = [];
  const chunkCount = Math.ceil(file.size / chunkSize);
  const MD5 = Crypto.algo.MD5.create();
  for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const fileChunk = file.slice(start, end);
    const fileContent = await fileChunk.arrayBuffer();
    const i8Array = new Uint8Array(fileContent);
    const wordArray = Crypto.lib.WordArray.create(Array.from(i8Array), i8Array.length);
    MD5.update(wordArray);
    fileChunks.push({ fileName, fileType, chunkIndex, chunkSize, chunkCount, fileChunk });
  }
  return {
    fileChunks,
    md5: MD5.finalize().toString(),
    uid: URL.createObjectURL(new Blob()).slice(-36),
  };
}

export const useUpload = ({ uploadFile, uploadConfirm, failureHandler }: UploadConfig) => {
  const loading = ref<boolean>(false);

  const error = ref<UploadError>();

  const progress = ref<number>(0);

  const execute = async (
    content: File | Blob | string,
    fileName: string,
    fileType: string,
    charset?: string
  ): Promise<UploadConfirmResult> => {
    if (typeof content === 'string') {
      content = new Blob([content], { type: `${fileType};charset=${charset}` });
    }
    loading.value = true;
    const { fileChunks, md5, uid } = await readFile(content, fileName, fileType);
    try {
      await Promise.all(
        fileChunks.map(async (chunk) => {
          const uploadResult = await uploadFile({ ...chunk, uid });
          progress.value = uploadResult.progress;
        })
      );
      const result = await uploadConfirm({ fileName, fileType, uid, md5 });
      progress.value = result.progress;
      return result;
    } catch (e) {
      error.value = new UploadError(fileName, e);
      failureHandler({ fileName, fileType, uid, md5 });
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    execute,
    loading,
    progress,
    error,
  };
};

export default useUpload;
