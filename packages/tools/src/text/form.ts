import { FormConfig } from '../types';

export const TextForm: FormConfig = [
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
        value: 1,
      },
      {
        label: 'line-2',
        value: 10,
      },
      {
        label: 'line-3',
        value: 20,
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
