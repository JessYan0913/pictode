import { FormConfig } from '@/form/types';

export const TextForm: FormConfig = [
  {
    name: 'fill',
    label: '描边',
    type: 'ColorPicker',
  },
  {
    name: 'strokeWidth',
    label: '字体大小',
    type: 'RadioGroup',
    optionType: 'text',
    options: [
      {
        label: 'S',
        value: 0.1,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
      {
        label: 'M',
        value: 0.5,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
      },
      {
        label: 'L',
        value: 1,
        class: 'w-[1rem] h-[1rem] flex items-center justify-center',
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
