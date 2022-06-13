import fs from 'fs';
import prettier from 'prettier';
import {StadiusRequest, StadiusResponse, TestSchema} from '.';

export class Generator {
  generate(suiteName: string, testSchemas: TestSchema[]) {
    // TODO validate testschemas
    const tests = testSchemas.map(({name, url, request, response}) =>
      Generator.generateTest(name, url, request, response),
    );
    const file = Generator.generateSuite(suiteName, tests);
    fs.writeFileSync(`${suiteName}.spec.ts`, file);
    return file;
  }

  static generateTest(testName: string, url: string, request: StadiusRequest, response: StadiusResponse) {
    request.body = request.body ?? {};
    request.headers = request.headers ?? {};
    return `
            it("${testName}", async () =>{
                ${Generator.generateRequestCall(url, request)}
                expect(response.statusCode).toBe(${response.status});
                ${Generator.generateBodyValidation(response.body)}
            }) 
      `;
  }

  static generateBodyValidation(body: Record<string, any>) {
    const isEmpty = Object.keys(body).length === 0;
    if (isEmpty) {
      return '';
    }
    return `hideFields(response.body);
     const expected = ${JSON.stringify(body)};
     hideFields(expected);
     expect(response.body).toMatchObject(expected)`;
  }

  static generateRequestCall(url: string, request: StadiusRequest) {
    // GET doesn't have body so we need to add , <body> for everything which is not GET
    const allowedMethods: Record<string, boolean> = {GET: true, POST: true, PUT: true, DELETE: true};
    if (!allowedMethods[request.method]) {
      console.log('Unsupported method:', request.method, 'request:', request);
      process.exit(1);
    }
    if (request.method == 'GET') {
      return `const response = await client.${request.method}("${url}", ${JSON.stringify(request.headers)});`;
    } else {
      const body = request.body ?? {};
      return `const response = await client.${request.method}("${url}", ${JSON.stringify(
        request.headers,
      )}, ${JSON.stringify(body)});`;
    }
  }

  static generateSuite(suiteName: string, tests: string[]) {
    return prettier.format(
      `import { client, hideFields } from "stadius";
        describe("${suiteName}", () => {
            ${tests.join('\n')}
        });
`,
      {parser: 'babel'},
    );
  }
}
