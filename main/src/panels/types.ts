import { FormConfig, FormValue } from '@/form/types';

export interface PanelConfig {
  bindTool: string[];
  bindShape: string[];
  formConfig: FormConfig;
  model: FormValue;
}
