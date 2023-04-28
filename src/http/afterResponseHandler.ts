import type { AfterResponseHook } from 'got/dist/source';

import type { Request, Response } from '.';

export const afterResponseHandler =
  (request: Request): AfterResponseHook =>
  async (response, retryWithMergedOptions) => {
    const requestAmendedForRetry =
      request.onResponseError !== undefined &&
      (await request.onResponseError(response as Response));
    if (
      requestAmendedForRetry !== false &&
      requestAmendedForRetry !== undefined
    ) {
      return retryWithMergedOptions(requestAmendedForRetry);
    }
    return response;
  };
