import 'supertest';
import client from '../client';
let field = jest.fn();
let attach = jest.fn();
let send = jest.fn();
let httpMethod = jest.fn().mockImplementation(() => {
  return {field, attach, send, set};
});
let set = jest.fn();

jest.mock('supertest', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((url: string) => {
      return {get: httpMethod, post: httpMethod, delete: httpMethod, put: httpMethod, patch: httpMethod};
    }),
  };
});

describe('sanity check client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test GET', async () => {
    await client.GET('fakeurl', {foo: 'bar'});
    expect(send).toBeCalled();
  });

  it('test POST', async () => {
    await client.POST('fakeurl', {}, {foo: 12});
    expect(send).toBeCalled();
    expect(send).toBeCalledWith({foo: 12});
  });

  it('test PUT', async () => {
    await client.PUT('fakeurl', {}, {foo: 12});
    expect(send).toBeCalled();
    expect(send).toBeCalledWith({foo: 12});
  });

  it('test PATCH', async () => {
    await client.PATCH('fakeurl', {}, {});
    expect(send).toBeCalled();
  });

  it('test DELETE', async () => {
    await client.DELETE('fakeurl', {});
    expect(send).toBeCalled();
  });
});
