import { PanelConfig } from '@/panels/types';

export const iframePanelConfig: PanelConfig = {
  bindTool: ['iframeTool'],
  bindShape: ['Iframe'],
  formConfig: [
    {
      name: 'url',
      label: '网址',
      type: 'Texts',
    },
    {
      name: 'stroke',
      label: '描边',
      type: 'Color',
    },
    {
      name: 'fill',
      label: '填充',
      type: 'Color',
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
      name: 'dash',
      label: '边框样式',
      type: 'RadioGroup',
      optionType: 'icon',
      options: [
        {
          label: 'line-1',
          value: [],
          title: '实线',
        },
        {
          label: 'dotted-line-2',
          value: [12, 8],
          title: '虚线',
        },
        {
          label: 'dotted-line-1',
          value: [6, 4],
          title: '点虚线',
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
    url: 'https://eslint.vuejs.org/rules/no-reserved-component-names',
    stroke: '#000000',
    fill: '#ffffff',
    strokeWidth: 2,
    cornerRadius: 20,
    dash: [],
    opacity: 1,
  },
};

export default iframePanelConfig;
