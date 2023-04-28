import { AppError } from '.';

export class HTTPRequestError extends AppError {
  constructor(public readonly code: string, cause?: unknown) {
    super(undefined, cause);
  }

  get logData(): Record<string, unknown> {
    return {
      ...super.logData,
      code: this.code,
    };
  }
}
