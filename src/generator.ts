import fs from 'fs';
import prettier from 'prettier';

interface StadiusRequest {
  headers: Record<string, string>;
  body: Record<string, any>;
  method: string; // TODO validate method
}

interface StadiusResponse {
  headers: Record<string, string>;
  body: Record<string, any>;
  status: number;
}

interface TestSchema {
  name: string;
  url: string;
  request: StadiusRequest;
  response: StadiusResponse;
}

export class Generator {
  generate(suiteName: string, testSchemas: TestSchema[]) {
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
    return `expect(response.body).toMatchObject(${JSON.stringify(body)})`;
  }

  static generateRequestCall(url: string, request: StadiusRequest) {
    // GET doesn't have body so we need to add , <body> for everything which is not GET
    // const optionalBody = request.method !== 'GET' ? `, ${request.body}` ?? {} : '';
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
      `import { client } from "stadius";
        describe("${suiteName}", () => {
            ${tests.join('\n')}
        });
`,
      {parser: 'babel'},
    );
  }
}
