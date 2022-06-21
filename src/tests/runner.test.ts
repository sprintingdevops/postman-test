import runTests from '../runner';

describe('Test Runner', () => {
  runTests([
    {
      name: 'Sanity check success',
      url: 'www.dir.bg',
      request: {method: 'GET', body: {}, headers: {}},
      response: {statusCode: 301},
    },
    {
      name: 'Sanity check success',
      url: 'www.dir.bg',
      request: {method: 'GET', body: {}, headers: {}},
      response: {headers: {server: 'cloudflare'}},
    },
  ]);
});
