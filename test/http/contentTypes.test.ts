import { contentTypes } from '../../src/http';

describe('contentTypes', () => {
  it('should be defined', () => {
    expect(contentTypes.applicationJson).toEqual('application/json');
    expect(contentTypes.applicationUrlEncodedForm).toEqual(
      'application/x-www-form-urlencoded'
    );
  });
});
