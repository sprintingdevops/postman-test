## Working with this example

This example shows off how to work with Stadius's test runner.
Stadius's intent is to run against a live system, therefore the project itself must run before the test script.

First install the dependencies for this project and run it in development mode:
```bash
$ npm i
$ npm run start:dev
```

In another shell run the command bellow to trigger the test suite using Stadius and the swagger validator:
```bash
$ npm run test:e2e
```
