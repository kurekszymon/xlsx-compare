const { xlsxCompare } = require('../../lib/index');

describe('Tests xlsx compare', () => {
  it('should succeed', () => {
    expect(xlsxCompare('fixtures/fixture.xlsx', 'fixtures/same.xlsx')).toEqual({
      success: true,
      differences: {},
    });
  });

  it('should fail', () => {
    expect(xlsxCompare('fixtures/fixture.xlsx', 'fixtures/different.xlsx')).toEqual({
      success: false,
      differences: {
        cells: {
          B5: { expected: 28900, received: 'Values' },
          B8: { expected: 20200, received: 'Are' },
          B11: { expected: 7200, received: 'Here' },
        },
        additionalCells: ['D5'],
        missingCells: ['B6'],
      },
    });
  });

  it('should fail with error message', () => {
    expect(xlsxCompare()).toEqual({
      error: 'Both file and fixture have to be defined.',
      success: false,
    });
  });
});
