import OpenAPIValidator from '../../../src/openapi';
import client from '../../../src/postman';

const schema: any = {
  openapi: '3.0.0',
  paths: {
    '/': {
      get: {
        operationId: 'AppController_getHello',
        parameters: [],
        responses: {
          '200': {
            description: 'The record has been successfully created.',
            content: {
              'application/json': {
                schema: {$ref: '#/components/schemas/ExampleResponseDto'},
              },
            },
          },
          '403': {description: 'Forbidden.'},
        },
      },
    },
  },
  info: {
    title: 'Preman example',
    description: 'Preman example api description',
    version: '1.0',
    contact: {},
  },
  tags: [{name: 'Preman Example', description: ''}],
  servers: [],
  components: {
    schemas: {
      ExampleResponseDto: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            readOnly: true,
            enum: ['success', 'failure'],
          },
          status: {type: 'number'},
        },
        required: ['message', 'status'],
      },
    },
  },
};

describe('AppController (e2e)', () => {
  const validator = new OpenAPIValidator();
  const url = 'localhost:3000';

  it('/ (GET) with swagger schema', async () => {
    const path = '/';
    await validator.initializeFromSchema(schema);

    const response = await client.GET(`${url}${path}`);

    const requestSwaggerErrors = validator.validateRequest('get', path, {});
    const responseSwaggerErrors = validator.validateResponse('get', path, response.statusCode, response.body);
    expect(responseSwaggerErrors).not.toBeDefined();
    expect(requestSwaggerErrors).not.toBeDefined();
    expect(response).toBeDefined();
  });

  it('/ (GET) with missing schema', async () => {
    const path = '/unexisting-path';
    await validator.initializeFromSchema(schema);

    const response = await client.GET(`${url}${path}`);

    const responseSwaggerErrors = validator.validateResponse('get', path, response.statusCode, response.body);
    expect(responseSwaggerErrors.length).toEqual(1);
    expect(response).toBeDefined();
  });
});
