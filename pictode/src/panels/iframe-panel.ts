import { PanelConfig } from '@/panels/types';

export const iframePanelConfig: PanelConfig = {
  bindTool: ['iframeTool'],
  bindShape: ['Iframe'],
  formConfig: [
    {
      name: 'src',
      label: '网址',
      type: 'Texts',
    },
    {
      name: 'stroke',
      label: '描边',
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
    src: 'https://cn.vuejs.org/',
    stroke: '#000000',
    strokeWidth: 2,
    dash: [],
    opacity: 1,
  },
};

export default iframePanelConfig;
