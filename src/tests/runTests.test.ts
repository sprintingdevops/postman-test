import runTests from '../runTests';

describe('Test Runner', () => {
  runTests([
    {
      name: 'Sanity check success',
      url: 'www.dir.bg',
      request: {method: 'GET'},
      response: {statusCode: 301},
    },
    {
      name: 'Sanity check not found',
      url: 'https://swapi.dev/api/people/131311',
      request: {method: 'GET'},
      response: {statusCode: 404},
    },
    {
      name: 'Partial body check',
      url: 'https://swapi.dev/api/people/1',
      request: {method: 'GET'},
      response: {
        statusCode: 200,
        body: {name: 'Luke Skywalker', height: '172'},
        headers: {'x-frame-options': 'SAMEORIGIN'},
      },
    },
    {
      name: 'Plain text',
      url: 'https://gist.githubusercontent.com/stanimirovv/e294b1ef80e4e4af7fdc6c1d8ab23889/raw/ef59cf3735bdf36569edbd23b1643b2e238fe270/plain_text',
      request: {method: 'GET'},
      response: {
        statusCode: 200,
        body: 'Hello world!',
      },
    },
    {
      name: 'JSON Array',
      url: 'https://jsonkeeper.com/b/U4RQ?', // Note the ? before the query string
      request: {method: 'GET', body: {example: 'query_param'}}, // The body is
      response: {
        statusCode: 200,
        body: [1, 2, 3, 4, 5],
      },
    },
  ]);
});
