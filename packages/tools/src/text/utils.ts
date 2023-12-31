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

  function setTextareaWidth(newWidth: number) {
    newWidth = Math.max(textarea.value.length * textNode.fontSize(), newWidth);

    //TODO: The platform detection should be a generic function.
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
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      if (textarea.value.trim().length >= 1) {
        textNode.text(textarea.value);
      } else {
        app.remove(textNode);
      }
      removeTextarea();
      onUpdated();
    }
    if (e.key === 'Escape') {
      removeTextarea();
    }
    const scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale - textNode.padding() * 2 + 20);
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
