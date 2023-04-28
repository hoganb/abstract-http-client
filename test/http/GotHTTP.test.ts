import nock from 'nock';

import { HTTPRequestError, HTTPResponseError } from '../../src/errors';
import type { Request, Response } from '../../src/http';
import { GotHTTP } from '../../src/http/GotHTTP';

describe('GotHTTP', () => {
  beforeAll(() => {
    // Disable real HTTP requests so we catch error if not nocked
    nock.disableNetConnect();
  });

  afterEach(() => {
    // Clean all HTTP mocks after each test
    nock.cleanAll();
  });

  afterAll(() => {
    // Enable real HTTP requests
    nock.enableNetConnect();
  });

  describe('send', () => {
    it('should resolve on 2xx status code response with body', async () => {
      const request: Request = {
        action: 'test',
        body: Buffer.from('hello world', 'utf-8'),
        method: 'POST',
        url: 'http://localhost/api',
      };
      nock('http://localhost').post('/api').reply(200, 'hello world', {
        'content-length': '11',
        'content-type': 'text/plain',
      });
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body).toBeInstanceOf(Buffer);
      expect(response.body.length).toEqual(11);
      expect(response.body.toString('utf-8')).toEqual('hello world');
    });

    it('should resolve on 2xx status code response without body', async () => {
      const request: Request = {
        body: Buffer.from('hello world', 'utf-8'),
        method: 'POST',
        url: 'https://localhost/api',
      };
      nock('https://localhost').post('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.statusCode).toEqual(204);
      expect(response.body).toBeDefined();
      expect(response.body).toBeInstanceOf(Buffer);
      expect(response.body.length).toEqual(0);
    });

    it('should recover from 4xx error with retry', async () => {
      const request: Request = {
        method: 'GET',
        url: 'https://localhost/api',
      };
      nock('https://localhost').get('/api').reply(429);
      nock('https://localhost').get('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.retryCount).toEqual(1);
      expect(response.statusCode).toEqual(204);
    });

    it('should be able to amend the request on response error and retry', async () => {
      const onResponseError = jest.fn(async (response: Response) => {
        if (response.statusCode === 401) {
          return Promise.resolve({
            headers: {
              Authorization: 'Bearer new',
            },
          });
        }
        return undefined;
      });
      const request: Request = {
        headers: {
          Authorization: 'Bearer expired',
        },
        method: 'GET',
        onResponseError,
        url: 'https://localhost/api',
      };
      nock('https://localhost').get('/api').reply(401);
      nock('https://localhost').get('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.statusCode).toEqual(204);
      expect(onResponseError).toHaveBeenCalledTimes(1);
    });

    it('should recover from 5xx error with retry', async () => {
      const request: Request = {
        method: 'GET',
        url: 'https://localhost/api',
      };
      nock('https://localhost').get('/api').reply(500);
      nock('https://localhost').get('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.retryCount).toEqual(1);
      expect(response.statusCode).toEqual(204);
    });

    it('should recover from network error with retry', async () => {
      const request: Request = {
        method: 'GET',
        url: 'https://localhost/api',
      };
      nock('https://localhost').get('/api').replyWithError({
        code: 'ETIMEDOUT',
        message: 'The request timed out',
      });
      nock('https://localhost').get('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.retryCount).toEqual(1);
      expect(response.statusCode).toEqual(204);
    });

    it('should recover from mixture of errors with retries', async () => {
      const request: Request = {
        backoff: {
          exponential: {
            factor: 10,
            noise: 1,
          },
        },
        method: 'GET',
        url: 'https://localhost/api',
      };
      nock('https://localhost').get('/api').reply(429);
      nock('https://localhost').get('/api').reply(504);
      nock('https://localhost').get('/api').replyWithError({
        code: 'ETIMEDOUT',
        message: 'The request timed out',
      });
      nock('https://localhost').get('/api').reply(204);
      const response: Response = await new GotHTTP({ retryLimit: 5 }).send(
        request
      );
      expect(response).toBeDefined();
      expect(response.retryCount).toEqual(3);
      expect(response.statusCode).toEqual(204);
    });

    it('should reject on 4xx status code response', async () => {
      const request: Request = {
        body: Buffer.from('hello world', 'utf-8'),
        method: 'POST',
        url: 'http://localhost:3000/api',
      };
      nock('http://localhost:3000')
        .post('/api')
        .reply(400, { error: { message: 'Validation error' } });
      try {
        await new GotHTTP({ retryLimit: 5 }).send(request);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(HTTPResponseError);
      }
    });

    it('should reject on 5xx status code response', async () => {
      const request: Request = {
        body: Buffer.from('hello world', 'utf-8'),
        method: 'POST',
        retryLimit: 0,
        url: 'http://localhost:3000/api',
      };
      nock('http://localhost:3000').post('/api').reply(500);
      try {
        await new GotHTTP({ retryLimit: 5 }).send(request);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(HTTPResponseError);
      }
    });

    it('should reject on network error', async () => {
      const request: Request = {
        body: Buffer.from('hello world', 'utf-8'),
        method: 'POST',
        retryLimit: 0,
        url: 'http://localhost:3000/api',
      };
      nock('http://localhost:3000').post('/api').replyWithError({
        code: 'ETIMEDOUT',
        message: 'The request timed out',
      });
      try {
        await new GotHTTP({ retryLimit: 5 }).send(request);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(HTTPRequestError);
      }
    });
  });
});
