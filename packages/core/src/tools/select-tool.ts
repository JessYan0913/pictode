import { ToolStrategy } from '../types';

export class SelectTool implements ToolStrategy {
  onMouseDown(event: MouseEvent): void {
    console.log('Method not implemented.', event);
  }
  onMouseMove(event: MouseEvent): void {
    console.log('Method not implemented.', event);
  }
  onMouseUp(event: MouseEvent): void {
    console.log('Method not implemented.', event);
  }
}
