export type Output = {
  error?: string;
  differences?: Diff;
  success: boolean;
};

export type Cell = {
  cell: string;
  value: unknown;
};

export type Diff = {
  cells: {
    [key: string]: {
      expected: unknown;
      received: unknown;
    };
  };
  additionalCells?: string[];
  missingCells?: string[];
};
