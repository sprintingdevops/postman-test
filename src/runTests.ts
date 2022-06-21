import {client, TestSchema} from '.';
import validateTestSchemas from './validateTestSchemas';

export default function runTests(tests: TestSchema[]) {
  validateTestSchemas(tests);

  it.each(tests)('Executing test: $name', async ({name, url, request, response}) => {
    let actualResult;
    if (request.method === 'GET') {
      actualResult = await client.GET(url, request.headers);
    } else {
      actualResult = await client.POST(url, request.headers, request.body);
    }

    if (response.statusCode) {
      expect(actualResult.statusCode).toEqual(response.statusCode);
    }

    if (response.body) {
      expect(actualResult.body).toMatchObject(response.body);
    }

    if (response.headers) {
      expect(actualResult.headers).toMatchObject(response.headers);
    }
  });
}
