import { FormConfig } from '@/form/types';

export default [
  {
    name: 'fill',
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
        value: 10,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
      {
        label: 'M',
        value: 12,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
      {
        label: 'L',
        value: 18,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
      {
        label: 'XL',
        value: 22,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
    ],
  },
  {
    name: 'opacity',
    label: '透明度',
    type: 'Slider',
  },
] as FormConfig;
