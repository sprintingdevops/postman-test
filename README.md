# Welcome to Preman

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Sprinting-Software_preman&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Sprinting-Software_preman)

Preman was created to get out of the bad Postman habits where backend developers get stuck in the bad habit of investing manual testing and experimentation effort inside Postman without ever building up the value of a shared Postman collection.
Preman is like Postman, but meant to be part of your source code.

Preman's intent is to be used against live, running instances.
With different configurations tests can be ran against different environments (e.g. vs DEV, UAT, PRD)
Assertion's are provided by jest, but the developer experiance is enchanced by helper libraries.

### How do I run preman suites ?

```
npm run test
```

### Now do I run some tests only ?

```
npm run test -- -t 'pattern here'
```

### What's the difference with pure jest ?

Jest is used under the hood, however standard jest test suites usually run against new instances of the code or parts of the code.

### What's the difference with cypress ?

Cypress is an amazing tool. It's focus is mainly UI testing. You can test APIs with it but there are a lot of dependencies and functionalities that are plain and simply redundant.
