import { App, Konva, Tool, ToolEvent, ToolHooks } from '@pictode/core';

const handleTextDoubleClick = (app: App, textNode: Konva.Text) => {
  textNode.hide();
  app.cancelSelect();
  let textPosition = textNode.absolutePosition();
  let areaPosition = {
    x: app.stage.container().offsetLeft + textPosition.x,
    y: app.stage.container().offsetTop + textPosition.y,
  };
  let textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.value = textNode.text() || ' ';
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
  textarea.style.color = textNode.stroke();
  textarea.style.caretColor = textNode.stroke();
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
  textarea.style.height = textarea.scrollHeight + 3 + 'px';

  textarea.focus();

  function removeTextarea() {
    textarea.parentNode?.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
  }

  function setTextareaWidth(newWidth: number) {
    newWidth = Math.max(textarea.value.length * textNode.fontSize(), newWidth);
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
      if (textarea.value.trim().length >= 1) {
        textNode.text(textarea.value);
      } else {
        app.remove(textNode);
      }
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

type TextOptions = Pick<Konva.TextConfig, 'stroke' | 'strokeWidth' | 'fontSize' | 'fontFamily' | 'opacity' | 'text'> & {
  hooks?: ToolHooks;
};

export class TextTool implements Tool {
  public name: string = 'textTool';
  public options?: TextOptions | undefined;
  public hooks?: ToolHooks | undefined;
  private textNode: Konva.Text | null = null;

  constructor(options: TextOptions) {
    this.options = options;
    this.hooks = options.hooks;
  }

  public doubleClick({ app, pointer }: ToolEvent) {
    this.textNode = new Konva.Text({
      ...this.options,
      text: ' ',
      x: pointer.x,
      y: pointer.y,
    });
    this.textNode.on<'dblclick'>('dblclick', ({ target }) => {
      handleTextDoubleClick(app, target as Konva.Text);
    });
    app.add(this.textNode);
    this.textNode.fire('dblclick');
  }
}

export default TextTool;
