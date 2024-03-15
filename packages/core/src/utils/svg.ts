export function generateSVG(shape: string, padding: number, size: number, color: string) {
  const svgNS = 'http://www.w3.org/2000/svg';

  // 创建 SVG 元素
  const svgElement = document.createElementNS(svgNS, 'svg');
  svgElement.setAttribute('xmlns', svgNS);
  svgElement.setAttribute('width', `${padding}`);
  svgElement.setAttribute('height', `${padding}`);

  // 根据形状生成路径
  let path;
  const a = size / Math.sqrt(3);
  switch (shape) {
    case 'circle':
      path = `M ${padding / 2},${padding / 2} 
                  m -${size}, 0 
                  a ${size},${size} 0 1,0 ${size * 2},0 
                  a ${size},${size} 0 1,0 -${size * 2},0`;
      break;
    case 'triangle':
      path = `M ${padding / 2},${padding / 2 - a} 
                  L ${padding / 2 - size / 2},${padding / 2 + a / 2} 
                  L ${padding / 2 + size / 2},${padding / 2 + a / 2} 
                  Z`;
      break;
    case 'diamond':
      path = `M ${padding / 2},${padding / 2 - size / 2} 
                  L ${padding / 2 - size / 2},${padding / 2} 
                  L ${padding / 2},${padding / 2 + size / 2} 
                  L ${padding / 2 + size / 2},${padding / 2} 
                  Z`;
      break;
    default:
      console.error('Unsupported shape');
      return;
  }

  // 创建路径元素并设置属性
  const pathElement = document.createElementNS(svgNS, 'path');
  pathElement.setAttribute('d', path);
  pathElement.setAttribute('fill', color);

  // 将路径元素添加到 SVG 中
  svgElement.appendChild(pathElement);

  // 将 SVG 元素转换为字符串
  const svgString = new XMLSerializer().serializeToString(svgElement);
  console.log(svgString);

  // 将 SVG 字符串转换为 Base64 格式
  return 'data:image/svg+xml;base64,' + btoa(svgString);
}
