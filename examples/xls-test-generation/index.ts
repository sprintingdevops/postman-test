import {exec} from 'child_process';
import {Generator, StadiusRequest, StadiusResponse} from 'stadius';

interface excelRow {
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

const buildRequest = (row: excelRow) => {
  const method = row[rowToField.method as keyof excelRow];
  let request: StadiusRequest = {method, body: {}, headers: {}};

  const body = row[rowToField.requestBody as keyof excelRow];
  if (body) {
    request.body = JSON.parse(body);
  }
  return request;
};

const buildResponse = (row: excelRow) => {
  const status = parseInt(row[rowToField.responseStatus as keyof excelRow]);
  let response: StadiusResponse = {status, headers: {}, body: {}};
  const body = row[rowToField.responseBody as keyof excelRow];

  if (body) {
    response.body = JSON.parse(body);
  }
  return response;
};

const main = () => {
  // Convert XLS to JSON
  exec('npx convert-excel-to-json --sourceFile=stadius-xml-generation.xlsx', (error, stdout, stderr) => {
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
