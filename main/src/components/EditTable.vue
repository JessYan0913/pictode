<script lang="ts" setup>
import { computed, provide, Ref, ref, watchEffect } from 'vue';
import { FormInstance } from 'element-plus';

export type RequestResult<T> = T[];

export type RequestFunc<T> = () => Promise<RequestResult<T>> | RequestResult<T>;

export interface EditTableProvide {}

export interface EditActions {
  addRow: (row?: Record<any, any>) => void;
  deleteRow: (index: number) => void;
  startEditable: (index: number) => void;
  cancelEditable: (index: number) => void;
  saveEditable: (index: number) => void;
}

export interface FormModelItem {
  isEditing: boolean;
  isNew: boolean;
  data: Record<string | number | symbol, any>;
  formData: Record<string | number | symbol, any>;
}

export interface FormModel {
  model: FormModelItem[];
}

export type FormProps = Set<string>;

const props = withDefaults(
  defineProps<{
    dataSource?: any[];
    request?: RequestFunc<any>;
  }>(),
  {
    dataSource: () => [],
  }
);

const formModel = ref<FormModel>({
  model: [],
});

const form = ref<FormInstance>();

const formProps = ref<FormProps>(new Set());

const tableData = computed(() => formModel.value.model.map(({ data }) => data));

const resultData = computed(() => {
  return formModel.value.model.reduce((resultData: any[], model: FormModelItem) => {
    if (model.isNew) {
      return resultData;
    }
    resultData.push({
      ...model.data,
    });
    return resultData;
  }, []);
});

const convertFormModel = (data: any[]): FormModelItem[] =>
  data.map(
    (row: any): FormModelItem => ({
      data: { ...row },
      formData: { ...row },
      isEditing: false,
      isNew: false,
    })
  );

watchEffect(async () => {
  const model = [...props.dataSource];
  if (typeof props.request === 'function') {
    model.push(...(await Promise.resolve(props.request())));
  }
  formModel.value.model = convertFormModel(model);
});

const generateValidateFields = (index: number) =>
  Array.from(formProps.value).map((prop) => `model.${index}.formData.${prop}`);

const startEditable = (index: number) => {
  formModel.value.model[index].isEditing = true;
};

const deleteRow = (index: number) => {
  formModel.value.model.splice(index, 1);
};

const addRow = (row: Record<any, any> = {}) => {
  formModel.value.model.push({
    data: { ...row },
    formData: { ...row },
    isEditing: true,
    isNew: true,
  });
};

const cancelEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  form.value.resetFields && form.value.resetFields(generateValidateFields(index));
  const formModelItem = formModel.value.model[index];
  formModelItem.formData = { ...formModelItem.data };
  if (formModelItem.isNew) {
    formModel.value.model.splice(index, 1);
  } else {
    formModelItem.isEditing = false;
  }
};

const saveEditable = (index: number) => {
  if (!form.value) {
    return;
  }

  form.value.validateField &&
    form.value.validateField(generateValidateFields(index), (validated: boolean) => {
      if (!validated) {
        return;
      }
      const formModelItem = formModel.value.model[index];
      formModelItem.data = { ...formModelItem.formData };
      formModelItem.isEditing = false;
      formModelItem.isNew = false;
    });
};

const editActions: EditActions = {
  addRow,
  deleteRow,
  startEditable,
  cancelEditable,
  saveEditable,
};

provide<Ref<FormModel>>('formModel', formModel);

provide<Ref<FormProps>>('formProps', formProps);

provide<EditActions>('editActions', editActions);

defineExpose({
  resultData,
  editActions,
});
</script>

<template>
  <div>
    <el-form ref="form" :model="formModel">
      <el-table v-bind="$attrs" :data="tableData">
        <slot> </slot>
      </el-table>
    </el-form>
  </div>
</template>
