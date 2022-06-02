import OpenAPIValidator from '../../../src/openapi';
import client from '../../../src/stadius';

describe('AppController (e2e)', () => {
  const validator = new OpenAPIValidator();
  const url = 'localhost:3000';

  beforeAll(async () => {
    const response = await client.GET(`${url}/api-json`);
    await validator.initializeFromSchema(response.body);
  });

  it('/ (GET) with swagger schema', async () => {
    const path = '/';

    const response = await client.GET(`${url}${path}`);

    const requestSwaggerErrors = validator.validateRequest('get', path, {});
    const responseSwaggerErrors = validator.validateResponse('get', path, response.statusCode, response.body);
    expect(responseSwaggerErrors).not.toBeDefined();
    expect(requestSwaggerErrors).not.toBeDefined();
    expect(response).toBeDefined();
  });

  it('/ (GET) with missing schema', async () => {
    const path = '/unexisting-path';

    const response = await client.GET(`${url}${path}`);

    const responseSwaggerErrors = validator.validateResponse('get', path, response.statusCode, response.body);
    expect(responseSwaggerErrors.length).toEqual(1);
    expect(response).toBeDefined();
  });
});
