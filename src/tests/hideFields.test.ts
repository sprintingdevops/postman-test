import hideFields from '../hideFields';

describe('test hiding functionality', () => {
  it('test hiding fields', () => {
    process.env.HIDE_FIELDS = 'a';
    let body = {a: 12, b: {a: 13}};
    const expected = {a: 'xxx', b: {a: 'xxx'}};
    hideFields(body);
    expect(body).toEqual(expected);
  });

  it('test field censorship', () => {
    process.env.HIDE_FIELDS = 'a';
    let body = {a: 12, b: {a: 13}};
    const expected = {a: 'xyz', b: {a: 'xyz'}};
    hideFields(body, 'xyz');
    expect(body).toEqual(expected);
  });

  it('test field empty array passed', () => {
    process.env.HIDE_FIELDS = undefined;
    let body = {a: 12, b: {a: 13}};
    const expected = {a: 12, b: {a: 13}};
    hideFields(body, 'xyz');
    expect(body).toEqual(expected);
  });
});
