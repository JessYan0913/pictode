import { PanelConfig } from '@/panels/types';

export const textPanelConfig: PanelConfig = {
  bindTool: ['textTool'],
  bindShape: ['Text'],
  formConfig: [
    {
      name: 'fill',
      label: '填充',
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
          title: 'S',
        },
        {
          label: 'M',
          value: 16,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
          title: 'M',
        },
        {
          label: 'L',
          value: 20,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
          title: 'L',
        },
        {
          label: 'XL',
          value: 24,
          class: 'w-[1rem] h-[1rem] flex items-center justify-center',
          title: 'XL',
        },
      ],
    },
    {
      name: 'stroke',
      label: '描边',
      type: 'ColorPicker',
    },
    {
      name: 'strokeWidth',
      label: '描边宽度',
      type: 'Slider',
      min: 0,
      max: 2,
    },
    {
      name: 'opacity',
      label: '透明度',
      type: 'Slider',
    },
  ],
  model: {
    stroke: '#000000',
    strokeWidth: 0,
    fill: '#000000',
    fontSize: 16,
    opacity: 1,
  },
};

export default textPanelConfig;
