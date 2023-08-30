import { PanelConfig } from '@/panels/types';

export const linePanelConfig: PanelConfig = {
  bindTool: ['lineTool', 'drawingTool'],
  bindShape: ['Line'],
  formConfig: [
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
      name: 'tension',
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
          value: 0.4,
        },
      ],
    },
    {
      name: 'dash',
      label: '边框样式',
      type: 'RadioGroup',
      optionType: 'icon',
      options: [
        {
          label: 'line-1',
          value: [],
        },
        {
          label: 'dotted-line-2',
          value: [12, 8],
        },
        {
          label: 'dotted-line-1',
          value: [6, 4],
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
    strokeWidth: 2,
    opacity: 1,
    tension: 0.4,
    dash: [],
  },
};

export default linePanelConfig;
