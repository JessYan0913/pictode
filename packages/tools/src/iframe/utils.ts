export const getIframeElement = (url: string): HTMLIFrameElement => {
  const iframeElement = document.createElement('iframe');
  iframeElement.src = url;
  iframeElement.style.width = '100%';
  iframeElement.style.height = '100%';
  iframeElement.style.boxSizing = 'border-box';
  return iframeElement;
};
