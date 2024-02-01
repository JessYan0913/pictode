export type FormValue = Record<string | number, any>;

export type FormSize = 'small' | 'default' | 'large';

export type FormState = {
  config: FormConfig;
  model: FormValue;
};

export interface FormHandlerData {
  model: FormValue;
  prop: string;
  config: ChildConfig;
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

export interface Rule {
  message?: string;
  /** 系统提供的验证器类型。有：string,number,boolean,method,regexp,integer,float,array,object,enum,date,url,hex,email,any */
  type?: string;
  required?: boolean;
  validator?: RuleValidatorHandler;
}

export type OnChangeHandler = (formState: FormState | undefined, value: any, data: FormHandlerData) => any;

export interface FormItem {
  type: string;
  name?: string;
  label?: string;
  class?: string;
  onChange?: OnChangeHandler;
}

export interface RadioGroupConfig extends FormItem {
  type: 'RadioGroup';
  optionType?: 'text' | 'icon';
  options: {
    value: string | number | boolean | Array<string | number | boolean>;
    label: string;
    class?: string;
    title?: string;
  }[];
}

export interface ColorPickerConfig extends FormItem {
  type: 'ColorPicker';
}

export interface SliderConfig extends FormItem {
  type: 'Slider';
  max?: number;
  min?: number;
  step?: number;
}

export interface CodeEditorConfig extends FormItem {
  type: 'CodeEditor';
  content?: string;
}

export type ChildConfig = FormItem | RadioGroupConfig | ColorPickerConfig | SliderConfig | CodeEditorConfig;

export type FormConfig = ChildConfig[];
