import { selectFile } from '@pictode/utils';

import { Image as Img } from '../customs/image';
import { Tool } from '../types';

import { selectTool } from './select-tool';

export const imageTool = (): Tool => {
  const imageObject = new Image();
  const img = new Img({
    image: imageObject,
    stroke: 'black',
    strokeWidth: 2,
  });

  return {
    name: 'imageTool',
    onActive(app) {
      app.cancelSelect();
      selectFile(['.jpg', '.png', '.jpge', '.PNG', '.JPG', '.JPGE'], false).then((files) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const fileDataUrl = event.target?.result as string;
          imageObject.src = fileDataUrl ?? '';
        };
        fileReader.readAsDataURL(files[0]);
      });
      app.add(img);
      app.setTool(selectTool(img));
    },
  };
};

export default imageTool;
