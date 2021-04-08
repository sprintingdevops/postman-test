import postman from '../postman';
describe('Demonstrate how api-tests work', () => {
  it('Demonstrate how to make a GET request', async () => {
    const result = await postman.GET('http://dummy.restapiexample.com/api/v1/employees');
    //console.log(result.text);
    // do nothing
  });

  it('Demonstrate how to make a POST request', async () => {
    const result = await postman.POST('http://dummy.restapiexample.com/api/v1/create', {"name":"test","salary":"123","age":"23"});
    //console.log(result.text);
    // do nothing
  });
});
