import { FormConfig } from '@/form/types';

export const TextForm: FormConfig = [
  {
    name: 'fill',
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
        value: 0.1,
      },
      {
        label: 'line-2',
        value: 0.5,
      },
      {
        label: 'line-3',
        value: 1,
      },
    ],
  },
  {
    name: 'opacity',
    label: '透明度',
    type: 'Slider',
  },
];

export default TextForm;
