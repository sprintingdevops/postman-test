import hideFields from '../hideFields';

describe('test hiding functionality', () => {
  it('test hiding fields', () => {
    process.env.HIDDEN_FIELDS = 'a';
    const body = {a: 12, b: {a: 13}};
    const expected = {a: 'xxx', b: {a: 'xxx'}};
    hideFields(body);
    expect(body).toEqual(expected);
  });

  it('test field censorship', () => {
    process.env.HIDDEN_FIELDS = 'a';
    const body = {a: 12, b: {a: 13}};
    const expected = {a: 'xyz', b: {a: 'xyz'}};
    hideFields(body, 'xyz');
    expect(body).toEqual(expected);
  });

  it('test field empty array passed', () => {
    process.env.HIDDEN_FIELDS = undefined;
    const body = {a: 12, b: {a: 13}};
    const expected = {a: 12, b: {a: 13}};
    hideFields(body, 'xyz');
    expect(body).toEqual(expected);
  });
});
