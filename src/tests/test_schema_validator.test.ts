import validateTestSchemas from '../test_schema_validator';

describe('Test Schema Validator', () => {
  it('wrong argument type', () => {
    expect(() => validateTestSchemas({} as any)).toThrow('tests must be an array, passed: object');
  });

  it('empty array of tests', () => {
    expect(() => validateTestSchemas([])).toBeTruthy();
  });

  test.each([
    [[{} as any, {} as any], 'Wrong Test Schema:  missing mandatory key: url'],
    [[1 as any], 'Wrong Test Schema:  test must be object'],
    [[{url: 'a'} as any], 'Wrong Test Schema:  missing mandatory key: name'],
    [[{name: 'a', url: 'a'} as any], 'Wrong Test Schema:  missing mandatory key: request'],
    [[{name: 'a', url: 'a', request: {}} as any], 'Wrong Test Schema:  missing mandatory key: response'],
    // Validate request object
    [
      [{name: 1, url: 'a', request: {}, response: {}} as any],
      'Wrong Test Schema:  type of key is wrong. Test name: 1, url: a',
    ],
    [
      [{name: 'a', url: 1, request: {}, response: {}} as any],
      'Wrong Test Schema:  type of key is wrong. Test name: a, url: 1',
    ],
    [[{name: 'a', url: 'a', request: {}, response: {}} as any], 'Wrong Test Schema:  missing mandatory key: headers '],
    [
      [{name: 'a', url: 'a', request: {headers: {}}, response: {}} as any],
      'Wrong Test Schema:  missing mandatory key: body ',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: {}}, response: {}} as any],
      'Wrong Test Schema:  missing mandatory key: method ',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: {}, method: 'a'}, response: {}} as any],
      'Wrong Test Schema:  unsupported method: a',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: 1, body: {}, method: 'a'}, response: {}} as any],
      'Wrong Test Schema:  wrong type in request: {"headers":1,"body":{},"method":"a"}',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: 1, method: 'a'}, response: {}} as any],
      'Wrong Test Schema:  wrong type in request: {"headers":{},"body":1,"method":"a"}',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: {}, method: 12}, response: {}} as any],
      'Wrong Test Schema:  wrong type in request: {"headers":{},"body":{},"method":12}',
    ],
    // Validate response object
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: {}, method: 'GET'}, response: {}} as any],
      'Wrong Test Schema:  missing mandatory key: headers ',
    ],
    [
      [{name: 'a', url: 'a', request: {headers: {}, body: {}, method: 'GET'}, response: {headers: {}}} as any],
      'Wrong Test Schema:  missing mandatory key: body ',
    ],
    [
      [
        {
          name: 'a',
          url: 'a',
          request: {headers: {}, body: {}, method: 'GET'},
          response: {headers: {}, body: {}},
        } as any,
      ],
      'Wrong Test Schema:  missing mandatory key: status ',
    ],
    [
      [
        {
          name: 'a',
          url: 'a',
          request: {headers: {}, body: {}, method: 'GET'},
          response: {headers: {}, body: {}, status: 'a'},
        } as any,
      ],
      'Wrong Test Schema:  wrong type in response: {"headers":{},"body":{},"status":"a"}',
    ],
  ])('Wrong schema', (args, expected) => {
    expect(() => validateTestSchemas(args)).toThrow(expected);
  });

  it('Correct schema', () => {
    const schema = [
      {
        url: 'test',
        name: 'test',
        request: {headers: {}, body: {}, method: 'GET'},
        response: {headers: {xheader: '123'}, body: [1, 2, 3], status: 200},
      },
      {
        url: 'test2',
        name: 'test2',
        request: {headers: {auth: '123'}, body: {foo: 'bar'}, method: 'POST'},
        response: {headers: {xheader: '123'}, body: [1, 2, 3], status: 500},
      },
    ];
    expect(validateTestSchemas(schema as any)).toBeTruthy();
  });
});
