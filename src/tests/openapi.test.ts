import OpenAPIValidator from '../openapi';
import schema from './testschema';

describe('OpenAPI Validator', () => {
  const path = '/api/v1/operation';
  /* 
    Request
  */
  it('correct requests pass', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    const errors = oav.validateRequest(
      'post',
      path,
      {
        'X-Correlation-ID': 'foo',
        'X-Request-ID': 'foo',
        'X-Tenant-ID': 100,
      },
      {},
    );
    expect(errors).toBeUndefined();
  });

  it('detects errors in request', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    const errors = oav.validateRequest(
      'post',
      path,
      {
        'X-Correlation-ID': 'foo',
        'X-Request-ID': 'foo',
      },
      {},
    );
    expect(errors.length).toBeGreaterThan(0);
  });

  it('requests fail on unexisting api', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    const errors = oav.validateRequest(
      'post123',
      path,
      {
        'X-Correlation-ID': 'foo',
        'X-Request-ID': 'foo',
        'X-Tenant-ID': 100,
      },
      {},
    );
    expect(errors[0].toString()).toEqual('Error: Unexisting API: /api/v1/operation-post123');
  });

  /* 
    Response
  */
  it('correct responses pass', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    const errors = oav.validateResponse('post', path, 200, {status: 10, message: 'hello', requestId: 'test'});
    expect(errors).toBeUndefined();
  });

  it('wrong responses fail', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    const errors = oav.validateResponse('post', path, 200, {status: {}, message: 12});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('responses fail on unexisting api', async () => {
    const oav = new OpenAPIValidator();
    await oav.initializeFromSchema(schema as any);
    try {
      oav.validateResponse('post123', path, 200, {status: {}, message: 12});
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Unexisting API: /api/v1/operation-post123');
    }
  });

  /*
    Validation
  */
  it('missing openapi property fails', async () => {
    const dummySchema: any = {};
    const oav = new OpenAPIValidator();
    try {
      await oav.initializeFromSchema(dummySchema);
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Missing openapi version in schema');
    }
  });

  it('wrong openapi version fails', async () => {
    const dummySchema: any = {openapi: 'wrong version'};
    const oav = new OpenAPIValidator();
    try {
      await oav.initializeFromSchema(dummySchema);
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Currently only OpenAPI V3 is supported');
    }
  });

  it('missing paths fails', async () => {
    const dummySchema: any = {openapi: '3.0.0'};
    const oav = new OpenAPIValidator();
    try {
      await oav.initializeFromSchema(dummySchema);
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Wrong schema type');
    }
  });

  it('wrong path type', async () => {
    const dummySchema: any = {
      openapi: '3.0.0',
      paths: {
        123: {},
      },
    };
    const oav = new OpenAPIValidator();
    try {
      await oav.initializeFromSchema(dummySchema);
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Wrong schema type');
    }
  });

  it('wrong path type', async () => {
    const dummySchema: any = {
      openapi: '3.0.0',
      paths: {
        '123': {fake_method: {}},
      },
    };
    const oav = new OpenAPIValidator();
    try {
      await oav.initializeFromSchema(dummySchema);
    } catch (error: unknown) {
      expect((error as Error).toString()).toEqual('Error: Not allowed HTTP method');
    }
  });
});
