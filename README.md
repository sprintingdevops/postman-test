# Welcome to Stadius

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)


A set of easy to use, battereis included libraries to make your life easier when testing and exploring APIs.
Stadius's intent is to be used against live, running instances.
With different configurations tests can be run against different environments (e.g. vs DEV, UAT, PRD)
Assertion's are provided by jest, but the developer experiance is enchanced by helper libraries.

### Main functionalities

#### Client Library

Stadius offers a request library based on ```supertest request```, but enchances it with verbouse logging.

a few examples:
```typescript
import { client } from "stadius";

await client.GET("https://my.api.dev", {})
const response = await client.POST(
      "https://my.api.dev/postable",
      {'Authorization': 'secret},
      { foo: "Bar" }
    );

```

#### Swagger Validation

Stadius also offers a swagger validation library.
It parses an OpenAPI v3 document and offers methods that validate the request and response against the swagger deffinitions.
This will allow to easily verify that the face of the API -> which is the Open API validation, whith the actual behaviour of the API 

Please navigate to ```examples/api-example``` for a demo.

#### Test Generation

Work in progress jest based test suite generation.


### How do I run stadius suites ?

```
npm run test
```

### How do I run some tests only ?

```
npm run test -- -t 'pattern here'
```

### What's the difference with pure jest and cypress ?

Jest is used under the hood, however standard jest test suites usually run against new instances of the code or parts of the code.
Cypress is an amazing tool. It's focus is mainly UI testing. You can test APIs with it but there are a lot of dependencies and functionalities that are plain and simply redundant.
