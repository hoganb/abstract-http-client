import type { Response } from '../http';
import { contentTypes, headerNames } from '../http';

import { AppError } from '.';

const getResponseBodyError = (response: Response): unknown => {
  if (
    response.body.length > 0 &&
    response.headers[headerNames.contentType]?.includes(
      contentTypes.applicationJson
    )
  ) {
    try {
      return JSON.parse(response.body.toString('utf-8'));
    } catch (error) {}
  }
  return undefined;
};

export class HTTPResponseError extends AppError {
  constructor(
    public readonly response: Response,
    public readonly cause: unknown
  ) {
    super(undefined, cause);
  }

  get logData(): Record<string, unknown> {
    return {
      ...super.logData,
      responseBody: getResponseBodyError(this.response),
    };
  }
}
