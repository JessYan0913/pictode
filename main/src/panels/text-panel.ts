import { PanelConfig } from '@/panels/types';

export const textPanelConfig: PanelConfig = {
  bindTool: 'textTool',
  bindShape: 'Text',
  formConfig: [
    {
      name: 'stroke',
      label: '描边',
      type: 'ColorPicker',
    },
    {
      name: 'fontSize',
      label: '字体大小',
      type: 'RadioGroup',
      optionType: 'text',
      options: [
        {
          label: 'S',
          value: 12,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
        },
        {
          label: 'M',
          value: 16,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
        },
        {
          label: 'L',
          value: 20,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
        },
        {
          label: 'XL',
          value: 24,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
        },
      ],
    },
    {
      name: 'opacity',
      label: '透明度',
      type: 'Slider',
    },
  ],
  model: {
    stroke: '#000000',
    fontSize: 12,
    opacity: 1,
  },
};

export default textPanelConfig;
