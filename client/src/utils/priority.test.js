import determinePriority from './priority';

describe('Priority', () => {
  it.each`
      value                                                 |  expected
      ${1000}                                                 | ${'High'}
      ${100}                                                  | ${'Medium'}
      ${50}                                                   | ${'Low'}
    
    `('priority for $value should be defined', async ({ value, expected }) => {
  const priority = determinePriority(value);

  expect(priority).toBe(expected);
});
});
