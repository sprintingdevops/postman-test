export default {
  openapi: '3.0.0',
  paths: {
    '/api/v1/operation': {
      post: {
        operationId: 'operationId',
        summary: 'Test operation used to validate the openapi request/response validator',
        description: '',
        parameters: [
          {
            name: 'X-Correlation-ID',
            required: false,
            in: 'header',
            description: 'Some meaningful description',
            schema: {type: 'string'},
          },
          {
            name: 'X-Request-ID',
            required: true,
            in: 'header',
            description: 'Some meaningful description',
            schema: {type: 'string'},
          },
          {
            name: 'X-Tenant-ID',
            required: true,
            in: 'header',
            description: 'Some meaningful description',
            schema: {type: 'number'},
          },
        ],
        requestBody: {},
        responses: {
          '200': {
            description: 'Operation performed succesfully',
            content: {'application/json': {schema: {$ref: '#/components/schemas/OperationResponseDto'}}},
          },
          '400': {description: 'Wrong request - missing or wrong argument'},
          '403': {description: 'Forbidden resource'},
          '500': {description: 'Internal error'},
        },
        security: [{bearer: []}],
      },
    },
  },
  info: {title: 'Example Service', description: 'Example Service public api calls', version: '1.0', contact: {}},
  tags: [],
  servers: [],
  components: {
    schemas: {
      OperationResponseDto: {
        type: 'object',
        properties: {
          status: {type: 'number'},
          message: {type: 'string'},
          nested: {type: 'array', items: {$ref: '#/components/schemas/NestedDto'}},
        },
        required: ['requestId'],
      },
      NestedDto: {
        type: 'object',
        properties: {
          status: {type: 'number'},
          message: {type: 'string'},
        },
      },
      JobIndexRequestDto: {type: 'object', properties: {}},
    },
  },
};
