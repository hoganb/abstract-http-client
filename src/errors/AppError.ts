import { isNonEmptyString, isObject } from '../util';

const getMessage = (message?: string, cause?: unknown): string | undefined => {
  if (isNonEmptyString(message)) {
    return message;
  }
  if (isObject(cause) && isNonEmptyString(cause.message)) {
    return cause.message;
  }
  if (isNonEmptyString(cause)) {
    return cause;
  }
  return undefined;
};

/**
 * All application errors should extend this class.
 */
export class AppError extends Error {
  constructor(message?: string, public readonly cause?: unknown) {
    super(getMessage(message, cause));
  }

  /**
   * This method transforms the error to its representation in the log.
   * It can be extended to log error-specific information.
   */
  get logData(): Record<string, unknown> {
    return {
      message: this.message,
      name: this.constructor.name,
      stack: this.stack,
      cause: this.cause,
    };
  }
}
