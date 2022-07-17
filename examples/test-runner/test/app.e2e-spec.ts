import { exec } from 'child_process';
import { setup } from 'jest-dev-server';
import { runTests } from 'stadius';

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    https: await setup({
      command: `npm run start:dev`,
      launchTimeout: 50000,
      port: 3000,
    });
  });

  afterAll((done) => {
    exec('lsof -ti tcp:3000 | xargs kill', (error) => {
      if (error) {
        console.log('ERROR:', error.toString());
      } else {
        console.log('Server stopped.');
      }
      done();
    });
  });

  runTests([
    {
      url: 'localhost:3000/',
      name: 'Test Root endpoint',
      request: { method: 'GET' },
      response: { statusCode: 200, body: 'Hello World!' },
    },
    {
      url: 'localhost:3000/arr',
      name: 'Test Array endpoint',
      request: { method: 'GET' },
      response: { statusCode: 200, body: [1, 2, 3] },
    },
    {
      url: 'localhost:3000/obj',
      name: 'Test Partial Object Match',
      request: { method: 'GET' },
      response: { statusCode: 200, body: { foo: 'bar' } },
    },
    {
      url: 'localhost:3000/person',
      name: 'Test Post request',
      request: { method: 'POST', body: { name: 'Test', age: 39 } },
      response: { statusCode: 201, body: { foo: 'bar' } },
    },
  ]);
});
