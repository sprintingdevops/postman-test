import runTests from '../runner';

describe('Test Runner', () => {
  runTests([
    {
      name: 'Sanity check success',
      url: 'www.dir.bg',
      request: {method: 'GET', body: {}, headers: {}},
      response: {status: 301, body: {}, headers: {}},
    },
    {
      name: 'Sanity check failure',
      url: 'www.dir.bg',
      request: {method: 'GET', body: {}, headers: {}},
      response: {status: 200, body: {}, headers: {}},
    },
  ]);
});
