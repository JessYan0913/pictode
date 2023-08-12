import { App } from '../app';
import { Text } from '../customs/text';
import { Tool } from '../types';

const handleTextDoubleClick = (app: App, textNode: Text) => {
  textNode.hide();
  app.cancelSelect();
  let textPosition = textNode.absolutePosition();
  let areaPosition = {
    x: app.stage.container().offsetLeft + textPosition.x,
    y: app.stage.container().offsetTop + textPosition.y,
  };
  let textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y + 'px';
  textarea.style.left = areaPosition.x + 'px';
  textarea.style.width = textNode.width() * textNode.scaleX() - textNode.padding() * 2 + 'px';
  textarea.style.height = textNode.height() * textNode.scaleX() - textNode.padding() * 2 + 5 + 'px';
  textarea.style.fontSize = textNode.fontSize() * textNode.scaleX() + 'px';
  textarea.style.border = 'none';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = textNode.lineHeight().toString();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();
  const rotation = textNode.rotation();
  let transform = '';
  if (rotation) {
    transform += 'rotateZ(' + rotation + 'deg)';
  }
  let px = 0;
  let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += 'translateY(-' + px + 'px)';

  textarea.style.transform = transform;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 3 + 'px';

  textarea.focus();

  function removeTextarea() {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
  }

  function setTextareaWidth(newWidth: number) {
    if (!newWidth) {
      newWidth = textNode.text.length * textNode.fontSize();
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    const isEdge = document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }
    textarea.style.width = newWidth + 'px';
  }

  textarea.addEventListener('keydown', function (e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea();
    }
    if (e.key === 'Escape') {
      removeTextarea();
    }
  });

  textarea.addEventListener('keydown', function () {
    const scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
  });

  function handleOutsideClick(e: MouseEvent) {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea();
    }
  }
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });
};

export const textTool = (): Tool => {
  let textNode: Text | null = null;

  return {
    name: 'textTool',
    onActive(app) {
      app.cancelSelect();
    },
    onMousedown({ app, pointer }) {
      if (textNode) {
        return;
      }
      textNode = new Text({
        stroke: 'black',
        text: '你好 Konva',
        strokeWidth: 0.1,
        fontSize: 20,
        fontFamily: 'JiaYouYa',
      });
      textNode.position(pointer);
      app.add(textNode);
      textNode.on<'dblclick'>('dblclick', ({ target }) => {
        handleTextDoubleClick(app, target as Text);
      });
    },
  };
};

export default textTool;
