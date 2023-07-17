import { ref, watch } from 'vue';

import useSelectFile from './useSelectFile';

export const useSelectFileUpload = (uploadFunc: Function) => {
  const loading = ref<boolean>(false);
  const error = ref<any>();

  const { error: selectFileError, execute: selectFileExecute } = useSelectFile();

  watch(
    () => selectFileError.value,
    (selectFileError) => (error.value = selectFileError)
  );

  const execute = async (accepts: string[] = ['*'], multiple: boolean = false) => {
    try {
      loading.value = true;

      const files = await selectFileExecute(accepts, multiple);
      return await uploadFunc(files);
    } catch (e) {
      error.value = e;
      throw e;
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

export default useSelectFileUpload;
