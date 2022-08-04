import { Cell, Diff, Output } from './types';

import { differenceWith, isEqual } from 'lodash';
import { readFile } from 'xlsx';

/**
 * Compares two given xlsx files
 * @param fixture path to the fixture file
 * @param file path to the file to be compared
 * @returns
 *
 * ```js
 * {
 * success: boolean,
 * error?: string,
 * differences: {
 *     cells: {},
 *     additionalCells?: [],
 *     missingCells?: []
 *   }
 * }
 * ```
 */
export const xlsxCompare = (fixture: string, file: string): Output => {
  if (!fixture || !file) {
    return {
      error: 'Both file and fixture have to be defined.',
      success: false,
    };
  }

  const errors = compareContentXLSX(fixture, file);
  const isSuccess = !errors?.cells || !errors.additionalCells?.length || !errors.missingCells?.length;

  return {
    success: isSuccess,
    differences: errors,
  };
};
const compareContentXLSX = (fixture: string, file: string): Diff => {
  const fixtureCells: Cell[] = getCells(fixture);
  const fileCells: Cell[] = getCells(file);

  const differences = {
    fixtureToFile: differenceWith(fixtureCells, fileCells, isEqual),
    fileToFixture: differenceWith(fileCells, fixtureCells, isEqual),
    get between() {
      const diff = {} as Diff;

      this.fixtureToFile.forEach(({ cell, value }) => {
        const difference = this.fileToFixture.find((difference) => difference.cell === cell);

        if (difference) {
          !diff.cells
            ? (diff.cells = {})
            : (diff.cells[cell] = {
                expected: value,
                received: difference.value,
              });
        }
      });

      const additionalCells = differenceWith(
        this.fileToFixture.map(({ cell }) => cell),
        this.fixtureToFile.map(({ cell }) => cell),
        isEqual,
      );

      const missingCells = differenceWith(
        this.fixtureToFile.map(({ cell }) => cell),
        this.fileToFixture.map(({ cell }) => cell),
        isEqual,
      );

      if (additionalCells.length) {
        diff.additionalCells = additionalCells;
        diff.missingCells = missingCells;
      }

      return diff as Diff;
    },
  };

  return differences.between;
};

const getCells = (file: string): Cell[] => {
  const fileSheets = readFile(file).Sheets;

  const [cells] = Object.keys(fileSheets).map((fileSheet) => {
    const sheet = fileSheets[fileSheet];
    const cellNames = Object.keys(sheet).filter((x) => !x.includes('!'));

    return cellNames.map((cell) => ({ cell, value: sheet[cell].v }));
  });

  return cells;
};

module.exports = { xlsxCompare };
