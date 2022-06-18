import {client, TestSchema} from '.';

export default function runTests(schema: TestSchema[]) {
  it.each(schema)(`Executing test: %{1}`, async ({name, url, request, response}) => {
    let result;
    if (request.method === 'GET') {
      result = await client.GET(url, request.headers);
    } else {
      result = await client.POST(url, request.headers, request.body);
    }
    expect(result.statusCode).toEqual(response.status);
  });
}
