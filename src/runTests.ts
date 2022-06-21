import {client, TestSchema} from '.';

export default function runTests(schema: TestSchema[]) {
  it.each(schema)(`Executing test: %{1}`, async ({name, url, request, response}) => {
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
      expect(actualResult.body).toEqual(response.body);
    }

    if (response.headers) {
      expect(actualResult.headers).toEqual(response.headers);
    }
  });
}
