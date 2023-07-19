import { BaseService, Context, Plugin } from '@pictode/core';

import './api';

export class History extends BaseService implements Plugin {
  public name: string = 'history';
  private context?: Context;

  constructor() {
    super();
  }

  public install(context: Context) {
    this.context = context;
  }

  public dispose(): void {
    throw new Error('Method not implemented.');
  }

  public enable(): void {
    throw new Error('Method not implemented.');
  }

  public disable(): void {
    throw new Error('Method not implemented.');
  }

  public isEnabled(): boolean {
    throw new Error('Method not implemented.');
  }
}

export default History;
