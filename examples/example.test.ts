import postman from '../src/postman';

const BASE_URL = 'http://dummy.restapiexample.com/api/v1';

describe('A Preman example collection', () => {
  it.skip('Demonstrate how to make Preman GET request', async () => {
    const result = await postman.GET(`${BASE_URL}/employees`);
    expect(result.body.status).toEqual('success');
    expect(result.body.data.length).toBeGreaterThan(0);
  });

  it.skip('Demonstrate how to make Preman POST request', async () => {
    const result = await postman.POST(`${BASE_URL}/create`, {}, {name: 'test', salary: '123', age: '23'});
    expect(result.status).toEqual(200);
    expect(result.body.status).toEqual('success');
  });
});
