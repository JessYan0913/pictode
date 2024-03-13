import { App, Konva } from '@pictode/core';

export const createTextarea = (app: App, textNode: Konva.Text, onUpdated: () => void) => {
  textNode.hide();
  let textPosition = textNode.absolutePosition();
  let areaPosition = {
    x: app.stage.container().offsetLeft + textPosition.x,
    y: app.stage.container().offsetTop + textPosition.y,
  };
  let textarea = document.createElement('textarea');
  app.stage.container().appendChild(textarea);

  let transform = '';
  const rotation = textNode.rotation();
  if (rotation) {
    transform += 'rotateZ(' + rotation + 'deg)';
  }
  let px = 0;
  let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += 'translateY(-' + px + 'px)';

  Object.assign(textarea.style, {
    position: 'absolute',
    display: 'inline-block',
    minHeight: '1em',
    backfaceVisibility: 'hidden',
    resize: 'none',
    background: 'transparent',
    overflow: 'hidden',
    overflowWrap: 'break-word',
    boxSizing: 'content-box',
    top: areaPosition.y + 'px',
    left: areaPosition.x + 'px',
    width: textNode.width() * textNode.scaleX() - textNode.padding() * 2 + 10 + 'px',
    height: textNode.height() * textNode.scaleX() - textNode.padding() * 2 + 5 + 'px',
    fontSize: textNode.fontSize() * textNode.scaleX() + 'px',
    border: 0,
    padding: 0,
    margin: 0,
    outline: 0,
    lineHeight: textNode.lineHeight().toString(),
    fontFamily: textNode.fontFamily(),
    textAlign: textNode.align(),
    color: textNode.stroke(),
    caretColor: textNode.stroke(),
    zIndex: '99999',
    transformOrigin: 'left top',
    transform: transform,
  });
  textarea.value = textNode.text();
  textarea.style.height = textarea.scrollHeight + 3 + 'px';
  textarea.focus();

  function removeTextarea() {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
  }

  textarea.addEventListener('keydown', function (e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      removeTextarea();
    }
  });

  textarea.addEventListener('input', () => {
    let text = textarea.value.replace(/\n/g, '<br/>'); // 将换行符替换为<br/>标签，以便正确测量宽度
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'pre-wrap'; // 保持文本的换行
    document.body.appendChild(tempDiv);
    const newWidth = tempDiv.offsetWidth + 10;
    textarea.style.width = newWidth + 'px'; // 设置宽度为文本实际宽度
    document.body.removeChild(tempDiv);
    textarea.style.height = textarea.scrollHeight + 'px';
    textNode.width(newWidth);
    textNode.height(textarea.scrollHeight);
  });

  function handleOutsideClick(e: MouseEvent) {
    if (e.target !== textarea) {
      if (textarea.value.trim().length >= 1) {
        textNode.text(textarea.value);
      } else {
        app.remove(textNode);
      }
      removeTextarea();
      onUpdated();
    }
  }
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });
};
