import { PanelConfig } from '@/types';

export const rectPanelConfig: PanelConfig = {
  bindTool: 'rectTool',
  bindShape: 'Rect',
  formConfig: [
    {
      name: 'stroke',
      label: '描边',
      type: 'ColorPicker',
    },
    {
      name: 'fill',
      label: '填充',
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
  ],
  model: {
    stroke: '#000000',
    fill: 'transparent',
    strokeWidth: 2,
    cornerRadius: 10,
    opacity: 1,
  },
};

export default rectPanelConfig;
