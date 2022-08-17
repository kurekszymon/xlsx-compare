# XLSX-COMPARE

Efficient way to compare excel files in the scope of content. Spot where the excel file differs to the cell.

## Response

### On Success

```js
{ success: true, differences: {} }
```

### On fail

```js
{
  success: false,
  differences: {
    cells: {
      B2: {
        expected: 39200,
        received: "Different"
      },
      B5: {
        expected: 28900,
        received: "Values"
      },
      B8: {
        expected: 20200,
        received: "Are"
      },
      B11: {
        expected: 7200,
        received: "Here"
      }
    },
    // optionally if file is missing or have some additional cells
    additionalCells: ["D5"],
    missingCells: ["B6"]
  }
}
```

## How to use it.

Within node

```js
const { xlsxCompare } = require("../index");

xlsxCompare("path/to/fixture.xlsx", "path/to/file.xlsx");
```

Within cypress

- `plugins file / cypress.config.js`

```js
const { xlsxCompare } = require("../index");

...
on("task", {
    ...
    "xlsx:compare"({fixture, file}) {
        return xlsxCompare(fixture, file)
    }
})
...
```

- `suite file`

```js
cy.task('xlsx:compare', {fixture, file}).then(...)
```
