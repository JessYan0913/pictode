export type FormValue = Record<string | number, any>;

export type FormSize = 'small' | 'default' | 'large';

export type FormItemLabelPosition = 'top' | 'left' | 'right';

export type FormState = {
  config: FormConfig;
  initValues: FormValue;
  formModel: FormValue;
  $emit: (event: any, ...args: any[]) => void;
  keyProp?: string;
  parentValues?: FormValue;
  setField: (prop: string, field: any) => void;
  getField: (prop: string) => any;
  deleteField: (prop: string) => any;
  [key: string]: any;
};

export interface FormHandlerData {
  /** 表单的初始值 */
  initValue: FormValue;
  /** 当前作用域下的值 */
  model: FormValue;
  parent?: FormValue;
  /** 整个表单的值 */
  formValue: FormValue;
  prop: string | number;
  config: any;
}

export type RuleValidatorHandler = (
  options: {
    rule: string;
    value: any;
    callback: Function;
    source: Object;
    options: {
      messages: string;
    };
  },
  data: FormHandlerData,
  formState: FormState | undefined
) => void;

export type TypeFunction = (
  mForm: FormState | undefined,
  data: {
    model: FormValue;
  }
) => string;

export interface Rule {
  message?: string;
  /** 系统提供的验证器类型。有：string,number,boolean,method,regexp,integer,float,array,object,enum,date,url,hex,email,any */
  type?: string;
  /** 是否必填 */
  required?: boolean;
  /** 自定义验证器 */
  validator?: RuleValidatorHandler;
}

export type OnChangeHandler = (formState: FormState | undefined, value: any, data: FormHandlerData) => any;

export interface FormItem {
  type: string | TypeFunction;
  name?: string;
  label?: string;
  onChange?: OnChangeHandler;
}

export interface RadioGroupConfig extends FormItem {
  type: 'RadioGroup';
  options: {
    value: string | number | boolean;
    text: string;
  }[];
}

export interface ColorPickConfig extends FormItem {
  type: 'ColorPicker';
}

export type ChildConfig = FormItem | RadioGroupConfig | ColorPickConfig;

export type FormConfig = ChildConfig[];
