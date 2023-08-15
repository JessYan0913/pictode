import { FormConfig } from '@/form/types';

export const formConfig: FormConfig = [
  {
    name: 'stroke',
    label: '描边',
    type: 'ColorPicker',
  },
  {
    name: 'strokeWidth',
    label: '描边宽度',
    type: 'RadioGroup',
    optionType: 'icon',
    options: [
      {
        label: 'line-1',
        value: 2,
      },
      {
        label: 'line-2',
        value: 4,
      },
      {
        label: 'line-3',
        value: 8,
      },
    ],
  },
  {
    name: 'opacity',
    label: '透明度',
    type: 'Slider',
  },
];

export default formConfig;
