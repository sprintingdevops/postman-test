import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { runTests } from 'stadius';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
