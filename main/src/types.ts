export type FormValue = Record<string | number, any>;

export type FormState = {
  config: FormConfig;
  popperClass?: string;
  initValues: FormValue;
  lastValues: FormValue;
  isCompare: boolean;
  values: FormValue;
  $emit: (event: string, ...args: any[]) => void;
  keyProp?: string;
  parentValues?: FormValue;
  setField: (prop: string, field: any) => void;
  getField: (prop: string) => any;
  deleteField: (prop: string) => any;
  [key: string]: any;
};

export type RuleValidator = (
  options: {
    rule: string;
    value: any;
    callback: Function;
    source: Object;
    options: {
      messages: string;
    };
  },
  data: {
    /** 表单的初始值 */
    values: FormValue;
    /** 当前作用域下的值 */
    model: FormValue;
    parent: FormValue;
    /** 整个表单的值 */
    formValue: FormValue;
    prop: string;
    config: any;
  },
  formState: FormState | undefined
) => void;

export interface Rule {
  message?: string;
  /** 系统提供的验证器类型。有：string,number,boolean,method,regexp,integer,float,array,object,enum,date,url,hex,email,any */
  type?: string;
  /** 是否必填 */
  required?: boolean;
  /** 自定义验证器 */
  validator?: RuleValidator;
}

type OnChangeHandler = (
  formState: FormState | undefined,
  value: any,
  data: {
    model: FormValue;
    values: FormValue;
    parent?: FormValue;
    formValue: FormValue;
    config: FormConfig;
  }
) => any;

export interface FormItem {
  type: string;
  name?: string;
  label?: string;
  onChange?: OnChangeHandler;
}

export interface RadioGroupConfig extends FormItem {
  type: 'radioGroup';
  options: {
    value: string | number | boolean;
    text: string;
  }[];
}

export interface ColorPickConfig extends FormItem {
  type: 'colorPicker';
}

export type FormConfig = FormItem | RadioGroupConfig | ColorPickConfig;
