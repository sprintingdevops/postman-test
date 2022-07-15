import {exec} from 'child_process';
import {Generator, StadiusRequest, StadiusResponse} from 'stadius';

interface ExcelRow {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
}

const rowToField = {
  name: 'A',
  method: 'B',
  url: 'C',
  requestBody: 'D',
  responseStatus: 'E',
  responseBody: 'F',
};

const buildRequest = (row: ExcelRow) => {
  const method = row[rowToField.method as keyof ExcelRow];
  let request: StadiusRequest = {method, body: {}, headers: {}};

  const body = row[rowToField.requestBody as keyof ExcelRow];
  if (body) {
    request.body = JSON.parse(body);
  }
  return request;
};

const buildResponse = (row: ExcelRow) => {
  const statusCode = parseInt(row[rowToField.responseStatus as keyof ExcelRow]);
  let response: StadiusResponse = {statusCode, headers: {}, body: {}};
  const body = row[rowToField.responseBody as keyof ExcelRow];

  if (body) {
    response.body = JSON.parse(body);
  }
  return response;
};

const main = () => {
  // Convert XLS to JSON
  exec('npx convert-excel-to-json --sourceFile=stadius-xml-generation.xlsx', (error, stdout, _stderr) => {
    if (error) {
      console.log('Error converting excel to JSON:', error);
      return;
    }
    const parsed = JSON.parse(stdout);

    // Generate a test suite for each page and a test for each row
    Object.keys(parsed).forEach((pageName) => {
      const tests = parsed[pageName].map((key: any) => ({
        name: key[rowToField.name],
        url: key[rowToField.url],
        request: buildRequest(key),
        response: buildResponse(key),
      }));
      const generator = new Generator();
      generator.generate(pageName, tests);
    });
  });
};
main();
