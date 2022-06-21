import runTests from '../runTests';

describe('Test Runner', () => {
  runTests([
    {
      name: 'Sanity check success',
      url: 'www.dir.bg',
      request: {method: 'GET', body: {}, headers: {}},
      response: {statusCode: 301},
    },
    {
      name: 'Sanity check not found',
      url: 'https://swapi.dev/api/people/131311',
      request: {method: 'GET', body: {}, headers: {}},
      response: {statusCode: 404},
    },
    {
      name: 'Partial body check',
      url: 'https://swapi.dev/api/people/1',
      request: {method: 'GET', body: {}, headers: {}},
      response: {statusCode: 200, body: {name: 'Luke Skywalker', height: '172'}},
    },
  ]);
});
