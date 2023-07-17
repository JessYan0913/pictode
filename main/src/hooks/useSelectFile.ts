import { ref } from 'vue';
import { FileSelectCancelError, IllegalFileError, selectFile } from '@tmp/utils';

export const useSelectFile = () => {
  const loading = ref<boolean>(false);

  const error = ref<FileSelectCancelError | IllegalFileError>();

  const execute = async (accepts: string[] = ['*'], multiple: boolean = false) => {
    try {
      loading.value = true;
      const files = await selectFile(accepts, multiple);
      return files;
    } catch (e) {
      if (e instanceof FileSelectCancelError || e instanceof IllegalFileError) {
        error.value = e;
      }
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

export default useSelectFile;
