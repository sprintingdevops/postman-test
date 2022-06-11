# Test suite generation

stadius can generate test suites for api e2e testing. Please refer to [ this file ]( ../../src/tests/generator.test.ts ) for an example schema and how to call the file.

This example builds on top of this functionality by extracting the data from xls file.

## Schema

For the excel file structure please refer to ```stadius-xml-generation.xlsx```.
The contents of the fields are self explanatory.
Expected values for method is capital HTTP verbs, i.e. GET, POST, PUT, etc
The test suite name is the name of the excel page.

One test suite will be generated for each page.

## Run this example

make sure all depedencies are installed ```npm i```

Then run the file generation:
```
npx ts-node index.ts
```

A new file will be generated: ```SW-Api.spec.ts```
This is the generated test suite from the example xls file.

To run the generated test file:
```
npm test
```


