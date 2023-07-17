export class BaseError extends Error {
  cause?: Error;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class EnvironmentError extends BaseError {
  constructor() {
    super('This is not a browser environment');
  }
}

export class FileSelectCancelError extends BaseError {
  constructor() {
    super('Cancel select');
  }
}

export class IllegalFileError extends BaseError {
  accepts: string[];

  constructor(accepts: string[]) {
    super(`Please select files in ${accepts} format`);
    this.accepts = accepts;
  }
}
