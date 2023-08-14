import { FormConfig } from '../types';

export const formConfig: FormConfig = [
  {
    name: 'stroke',
    label: '描边',
    type: 'ColorPicker',
  },
  {
    name: 'fill',
    label: '背景',
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
    name: 'cornerRadius',
    label: '边角',
    type: 'RadioGroup',
    optionType: 'icon',
    options: [
      {
        label: 'node-flat',
        value: 0,
      },
      {
        label: 'node-round',
        value: 10,
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
