import {StadiusRequest} from './interfaces/stadius_request';
import {StadiusResponse} from './interfaces/stadius_response';
import {TestSchema} from './interfaces/test_schema';

export default function validateTestSchemas(tests: TestSchema[]): boolean {
  if (!Array.isArray(tests)) {
    throw new Error(`tests must be an array, passed: ${typeof tests}`);
  }

  tests.forEach((test) => validateTest(test));

  return true;
}

const errorPrefix = 'Wrong Test Schema: ';

const allowedMethods: Record<string, boolean> = {
  GET: true,
  POST: true,
  PUT: true,
  DELETE: true,
  PATCH: true,
};

const validateTest = (test: TestSchema) => {
  if (!test || typeof test !== 'object') {
    throw new Error(`${errorPrefix} test must be object`);
  }
  const keys = Object.keys(test);
  const mandatoryKeys = ['url', 'name', 'request', 'response'];
  mandatoryKeys.forEach((key) => {
    if (!keys.includes(key)) {
      throw new Error(`${errorPrefix} missing mandatory key: ${key} `);
    }
  });

  const hasInvalidBaseFields = typeof test.name !== 'string' || typeof test.url !== 'string';
  if (hasInvalidBaseFields) {
    throw new Error(`${errorPrefix} type of key is wrong. Test name: ${test.name}, url: ${test.url}`);
  }

  validateRequest(test.request);
  validateResponse(test.response);
};

const validateRequest = (request: StadiusRequest) => {
  const keys = Object.keys(request);
  const mandatoryKeys = ['headers', 'body', 'method'];
  mandatoryKeys.forEach((key) => {
    if (!keys.includes(key)) {
      throw new Error(`${errorPrefix} missing mandatory key: ${key} `);
    }
  });

  const hasWrongTypes =
    typeof request.headers !== 'object' || typeof request.body !== 'object' || typeof request.method !== 'string';
  if (hasWrongTypes) {
    throw new Error(`${errorPrefix} wrong type in request: ${JSON.stringify(request)}`);
  }

  if (!allowedMethods[request.method]) {
    throw new Error(`${errorPrefix} unsupported method: ${request.method}`);
  }
};

const validateResponse = (response: StadiusResponse) => {
  const keys = Object.keys(response);
  const mandatoryKeys = ['headers', 'body', 'status'];
  mandatoryKeys.forEach((key) => {
    if (!keys.includes(key)) {
      throw new Error(`${errorPrefix} missing mandatory key: ${key} `);
    }
  });

  const hasWrongTypes =
    typeof response.headers !== 'object' || typeof response.body !== 'object' || typeof response.status !== 'number';
  if (hasWrongTypes) {
    throw new Error(`${errorPrefix} wrong type in response: ${JSON.stringify(response)}`);
  }
};
