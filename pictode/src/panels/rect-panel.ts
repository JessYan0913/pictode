import { PanelConfig } from '@/panels/types';

export const rectPanelConfig: PanelConfig = {
  bindTool: ['rectTool'],
  bindShape: ['Rect'],
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
          title: '细',
        },
        {
          label: 'line-2',
          value: 4,
          title: '粗',
        },
        {
          label: 'line-3',
          value: 8,
          title: '特粗',
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
          title: '直角',
        },
        {
          label: 'node-round',
          value: 20,
          title: '圆角',
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
    fill: '#ffffff',
    strokeWidth: 2,
    cornerRadius: 20,
    opacity: 1,
  },
};

export default rectPanelConfig;
