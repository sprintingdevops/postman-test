import supertest from 'supertest';
import {client, StadiusResponse, TestSchema} from '.';
import validateTestSchemas from './validateTestSchemas';

export default function runTests(tests: TestSchema[]) {
  validateTestSchemas(tests);

  it.each(tests)('Executing test: $name', async ({name, url, request, response}) => {
    const actualResult = await getResult({name, url, request, response});
    const expectedResponse = response;

    if (expectedResponse.statusCode) {
      expect(actualResult.statusCode).toEqual(expectedResponse.statusCode);
    }

    if (expectedResponse.body) {
      validateBody(expectedResponse, actualResult);
    }

    if (expectedResponse.headers) {
      expect(actualResult.headers).toMatchObject(expectedResponse.headers);
    }
  });
}

const getResult = async ({url, request}: TestSchema) => {
  if (request.method === 'GET') {
    return client.GET(url, request.headers);
  } else if (request.method === 'POST') {
    return client.POST(url, request.headers, request.body);
  } else if (request.method === 'PUT') {
    return client.PUT(url, request.headers, request.body);
  } else if (request.method === 'PATCH') {
    return client.PATCH(url, request.headers, request.body);
  } else if (request.method === 'DELETE') {
    return client.DELETE(url, request.headers);
  } else {
    throw new Error(`Unknown HTTP verb: ${request.method}`);
  }
};

const validateBody = (expectedResponse: StadiusResponse, actualResponse: supertest.Response) => {
  const bodyType = typeof expectedResponse.body;
  if (bodyType === 'object' && !Array.isArray(expectedResponse.body)) {
    expect(actualResponse.body).toMatchObject(expectedResponse.body);
  } else if (bodyType === 'string') {
    expect(actualResponse.text).toContain(expectedResponse.body);
  } else {
    expect(actualResponse.body).toEqual(expectedResponse.body);
  }
};
