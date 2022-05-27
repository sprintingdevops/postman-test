import $RefParser, {JSONSchema} from '@apidevtools/json-schema-ref-parser';
import OpenAPIRequestValidator, {OpenAPIRequestValidatorArgs} from 'openapi-request-validator';
import OpenAPIResponseValidator, {OpenAPIResponseValidatorArgs} from 'openapi-response-validator';
import {OpenAPIV3} from 'openapi-types';

type OpenAPIArgs = OpenAPIRequestValidatorArgs & OpenAPIResponseValidatorArgs;
interface OpenAPISchema {
  paths: Record<string, Record<string, OpenAPIArgs>>;
  openapi: string;
  components: OpenAPIV3.ComponentsObject;
}

const allowedMethod: Record<string, boolean> = {get: true, post: true, delete: true, head: true, put: true};

export default class OpenAPIValidator {
  private requestValidators: Record<string, OpenAPIRequestValidator> = {};
  private responseValidators: Record<string, OpenAPIResponseValidator> = {};

  async initializeFromSchema(schema: OpenAPISchema) {
    const derefedSchema = await OpenAPIValidator.dereferenceSchema(schema);
    if (!('openapi' in derefedSchema)) {
      throw new Error('Missing openapi version in schema');
    }
    if (derefedSchema.openapi !== '3.0.0') {
      throw new Error('Currently only OpenAPI V3 is supported');
    }
    if (!('paths' in derefedSchema)) {
      throw new Error('Wrong schema type');
    }

    for (const url in derefedSchema.paths) {
      for (const method in derefedSchema.paths[url]) {
        // validate path exists
        if (typeof url !== 'string' || typeof method !== 'string') {
          throw new Error('Wrong schema');
        }
        if (!allowedMethod[method]) {
          throw new Error('Not allowed HTTP method');
        }

        // generate unique key
        const key = OpenAPIValidator.generateKey(method, url);
        const validatorArgs = derefedSchema.paths[url][method];

        // Initializes Request/Response validator
        this.requestValidators[key] = new OpenAPIRequestValidator(validatorArgs);
        this.responseValidators[key] = new OpenAPIResponseValidator(validatorArgs);
      }
    }
  }

  validateRequest(method: string, url: string, headers: Record<string, unknown>, body: Record<string, unknown> = {}) {
    const key = OpenAPIValidator.generateKey(method, url);
    if (this.requestValidators[key] === undefined) {
      throw new Error(`Unexisting API: ${key}`);
    }

    return this.requestValidators[key].validateRequest({headers, body});
  }

  validateResponse(method: string, url: string, statusCode: number, response: unknown) {
    const key = OpenAPIValidator.generateKey(method, url);
    if (this.requestValidators[key] === undefined) {
      throw new Error(`Unexisting API: ${key}`);
    }

    return this.responseValidators[key].validateResponse(statusCode, response);
  }

  static async dereferenceSchema(schema: OpenAPISchema): Promise<JSONSchema> {
    try {
      return await $RefParser.dereference(schema);
    } catch (err) {
      throw new Error('Failed dereferencing schema');
    }
  }

  static generateKey(method: string, url: string) {
    return `${url}-${method}`;
  }
}
