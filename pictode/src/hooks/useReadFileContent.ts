import { ref, watch } from 'vue';
import { FileSelectCancelError, IllegalFileError } from '@pictode/utils';

import useSelectFile from './useSelectFile';

export const useReadFileContent = () => {
  const loading = ref<boolean>(false);

  const error = ref<FileSelectCancelError | IllegalFileError | any>();

  const { error: selectFileError, execute: selectFileExecute } = useSelectFile();

  watch(
    () => selectFileError.value,
    (e) => {
      error.value = e;
    },
  );

  const execute = async (accepts: string[] = ['*']): Promise<string | undefined> => {
    try {
      loading.value = true;
      const files = (await selectFileExecute(accepts)) ?? [];
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onload = ({ target }) => {
          resolve(target?.result as string);
        };
        fileReader.onerror = (e) => {
          error.value = e;
          reject(error.value);
        };
        fileReader.readAsText(files[0]);
      });
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    execute,
  };
};

export default useReadFileContent;
