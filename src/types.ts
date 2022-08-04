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
      expected: any;
      received: any;
    };
  };
  additionalCells?: string[];
  missingCells?: string[];
};
