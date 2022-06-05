import fs from 'fs';
import {Generator} from '../generator';

const pathToSampleFiles = 'src/tests/samplefiles';
const testSchemas = [
  {
    name: 'test 1',
    url: 'https://swapi.dev/api/people/1',
    request: {method: 'GET', body: {}, headers: {}},
    response: {
      body: {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [
          'https://swapi.dev/api/films/1/',
          'https://swapi.dev/api/films/2/',
          'https://swapi.dev/api/films/3/',
          'https://swapi.dev/api/films/6/',
        ],
        species: [],
        vehicles: ['https://swapi.dev/api/vehicles/14/', 'https://swapi.dev/api/vehicles/30/'],
        starships: ['https://swapi.dev/api/starships/12/', 'https://swapi.dev/api/starships/22/'],
        created: '2014-12-09T13:50:51.644000Z',
        edited: '2014-12-20T21:17:56.891000Z',
        url: 'https://swapi.dev/api/people/1/',
      },

      headers: {},
      status: 200,
    },
  },
  {
    name: 'test 2',
    url: 'https://swapi.dev/api/people/2',
    request: {method: 'POST', body: {foo: 'Bar'}, headers: {}},
    response: {body: {}, headers: {}, status: 405},
  },
];

describe('Test Generator', () => {
  it('basic validation', () => {
    const suiteName = 'generator-basic-test';
    const fileName = `${suiteName}.spec.ts`;
    const gn = new Generator();
    gn.generate(suiteName, testSchemas);
    const generatedText = fs.readFileSync(fileName, 'utf8');
    const expectedText = fs.readFileSync(`${pathToSampleFiles}/${fileName}`, 'utf8');
    expect(generatedText).toEqual(expectedText);

    // fs.unlinkSync(fileName);
  });
});
