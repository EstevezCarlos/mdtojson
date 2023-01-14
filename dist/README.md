# MTTJ
**M**arkdown **T**able **T**o **J**SON

## What does it do?

MTTJ takes markdown table and convert it to list of JavaScript objects:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

🔽🔽🔽

```json
[
  { "Column 1": "Cell 1", "Column 2": "Cell 2", "Column 3": "Cell 3" },
  { "Column 1": "Cell 4", "Column 2": "Cell 5", "Column 3": "Cell 6" }
]
```

Now you can sanely create content rich website, without need to maintain a database.

**Disclaimer** 

MTTJ is not intended to create dynamic website. It only allows one way communication. To create dynamic website you need a database.

## Installation

As for now MTTJ is only available as node package.

```bash
npm i mttj
```

## Usage

### Basics
**Read markdown string**

file.js

```js
const mttj = require('mttj')

const md = `
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

const obj = mttj.parseString(md)

console.log(obj)
```

expected output

```bash
[
  { 'Column 1': 'Cell 1', 'Column 2': 'Cell 2', 'Column 3': 'Cell 3' },
  { 'Column 1': 'Cell 4', 'Column 2': 'Cell 5', 'Column 3': 'Cell 6' }
]
```

**Read markdown file**

file.md

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

file.js

```js
const mttj = require('mttj')

const obj = mttj.parseFileSync('file.md')
console.log(obj)
```

output

```bash
[
  { 'Column 1': 'Cell 1', 'Column 2': 'Cell 2', 'Column 3': 'Cell 3' },
  { 'Column 1': 'Cell 4', 'Column 2': 'Cell 5', 'Column 3': 'Cell 6' }
]
```

**Multiple tables**

Reading string/file containing multiple tables result in creating object, containing data in separate keys.
Keys are created based on preceding headers. If there is no header present, key will be `table_$`
Keys are in URL safe format.

file.md

```markdown
# Header

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

# Another header

| a   | b   |
| --- | --- |
| a1  | b1  |
| a2  | b2  |

| one | two | three |
| --- | --- | ----- |
| qwe | rty | uio   |
| asd | fgh | jkl   |
| zxc | vbn | m     |

```

file.js

```js
const mttj = require('mttj')

const obj = mttj.parseFileSync('file.md')
console.log(obj)
```

output

```bash
{
  header: [
    {
      'Column 1': 'Cell 1',
      'Column 2': 'Cell 2',
      'Column 3': 'Cell 3'
    },
    {
      'Column 1': 'Cell 4',
      'Column 2': 'Cell 5',
      'Column 3': 'Cell 6'
    }
  ],
  another_header: [ { a: 'a1', b: 'b1' }, { a: 'a2', b: 'b2' } ],
  table_1: [
    { one: 'qwe', two: 'rty', three: 'uio' },
    { one: 'asd', two: 'fgh', three: 'jkl' },
    { one: 'zxc', two: 'vbn', three: 'm' }
  ]
}
```

### Flags
Flags modify `parseFileSync` and `parseString` behavior. Flags are second argument in both functions - pass it as object.

**unpack**

Default value `true`. If `true` and there is only one table in markdown, returns array of rows.

file.md

```markdown
# Header

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

file.js

```js
const mttj = require('mttj')

console.log(
    '\n---------------- false ----------------\n',
    mttj.parseFileSync('file.md',{unpack:false}),
    '\n------------ true (default) -----------\n',
    mttj.parseFileSync('file.md',{unpack:true})
)
```

output

```bash
 {
  header: [
    {
      'Column 1': 'Cell 1',
      'Column 2': 'Cell 2',
      'Column 3': 'Cell 3'
    },
    {
      'Column 1': 'Cell 4',
      'Column 2': 'Cell 5',
      'Column 3': 'Cell 6'
    }
  ]
}
------------ true (default) -----------
 [
  { 'Column 1': 'Cell 1', 'Column 2': 'Cell 2', 'Column 3': 'Cell 3' },
  { 'Column 1': 'Cell 4', 'Column 2': 'Cell 5', 'Column 3': 'Cell 6' }
]
```

**unpackTables**

Default value `true`. If `true` and there is only one row in table returns array as JSON, not array.


## Technical details

### Plans

- Method to read files in `async` manner
- Filter flag (similar to MySql `where` statement )
- Select specific colums flag (similar ro MySql `select`)
- Column flag (similar to MySql `from`)
- Table flag (select specific table)
- First flag (select only first `n` tables)
- Limit flag (select only first `n` rows of each table)
- Optional type interpretation
- Python module with similar use

### Patch Notes
v 0.1.11
- Fixed `require('mttj')` bug.
- Added flags to `parseFileSync` and `parseString` methods.

v 0.1.10

- Much more detailed README.md

v 0.1.9
- Comments `<!--  -->` are removed before processing
- By default markdown with single table is unpacked
- By default table with single row is unpacked
- Fixed some minor bugs

v 0.1.8

- Minimum value product
