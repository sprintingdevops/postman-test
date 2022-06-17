# Welcome to Stadius

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)


A set of easy to use, batteries included libraries to make your life easier when testing and exploring APIs.
Stadius's intent is to be used against live, running instances.
With different configurations tests can be run against different environments (e.g. vs DEV, UAT, PRD)
Stadus is test runner and assertion library agnostic, but for now the generator is tested against jest.

## Main functionalities

### Client Library

Stadius offers a request library based on ```supertest request```, but enhances it with verbose logging

a few examples:
```typescript
import { client } from "stadius";

await client.GET("https://my.api.dev", {})
const response = await client.POST(
      "https://my.api.dev/postable", // url
      {'My Header': '123}, // headers
      { foo: "Bar" } // body
    );

```

#### Instance Clients
Sometimes you may want to have several different clients with Base Urls and repeatable headers.
For these cases stadius exports it's class stadius:

```typescript
import { Stadius } from "stadius";

const customClient = new Staidus("myBaseUrl", {"X-Common-Header": "Headers that will be added to each request" });
// NOTE: common headers are added **before** the request headers. You can override them for a single request if needed.

```

### Swagger Validation

Stadius also offers a swagger validation library.
It parses an OpenAPI v3 document and offers methods that validate the request and response against the swagger definitions.
This will allow to easily verify that the face of the API -> which is the Open API validation, with the actual behavior of the API 

Please navigate to ```examples/api-example``` for a demo.

### Test Generation
Stadius has a test generation module. Simply put it will generate one or more test suites based on a schema you pass.
By itself this functionality is useful because the user can declare request/response pairs and can generate and regenerate tests on demand for different environments, etc.
For a basic example please navigate to [the test](src/tests/generator.test.ts)

The functionality is better when combined with an external source.
Please navigate to [this example](examples/xls-test-generation) to see an example with generating tests from an excel document.

### Utility Functions

#### Field hiding
Setting the ```HIDDEN_FIELDS``` environment variable to a comma separated list of field names and then using the ```hideFields``` utility function
will replace all occurrences of these keys in an object and replace them with a suplied value, default xxx.

```typescript
const example = {a: 12, b: {a: 13}};
hideFields(body); // after this call example will equal: {a: 'xxx', b: {a: 'xxx'}};
```
[More examples](src/tests/hideFields.test.ts)

## Configuration
Stadius uses environment variables for the configuration.
For complete list of options please visit ```config.ts``` but the two most important ones are:
```
VERBOSE_LOGGING - if set to true headers will also be logged. By default they are {}
SILENT - if set to true no log output will be made
AUTH - if set the value will be added as Authorization header
```


### What's the difference with pure jest or cypress ?

Jest is used under the hood, however standard jest test suites usually run against new instances of the code or parts of the code.
Cypress is an amazing tool. It's focus is mainly UI testing. You can test APIs with it but there are a lot of dependencies and functionalities that are plain and simply redundant.
