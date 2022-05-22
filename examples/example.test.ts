import postman from "../src/postman";
describe("A Preman example collection", () => {
  it("Demonstrate how to make Preman GET request", async () => {
    const result = await postman.GET(
      "http://dummy.restapiexample.com/api/v1/employees"
    );
  });

  it("Demonstrate how to make Preman POST request", async () => {
    const result = await postman.POST(
      "http://dummy.restapiexample.com/api/v1/create",
      {},
      { name: "test", salary: "123", age: "23" }
    );
  });
});
