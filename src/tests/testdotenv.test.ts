import client from '../client';

describe('test dotenv', () => {
  it('test doetenv variable loaded', () => {
    expect(client).toBeDefined();
    expect(process.env['EXAMPLE_VAR']).toBeDefined();
  });
});
