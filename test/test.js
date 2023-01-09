import mttj from '../dist/app.js';

const md00 = `
# Header

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

# Another header

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
const md01 = `
# Header

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;


const md02 = `
# Header

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
`;

const objF00 = mttj.parseFileSync('./test/00.md')
const objF01 = mttj.parseFileSync('./test/01.md')
const objF02 = mttj.parseFileSync('./test/02.md')
const objS00 = mttj.parseString(md00)
const objS01 = mttj.parseString(md01)
const objS02 = mttj.parseString(md02)
// console.log(objS00)
// console.log(objS01)
console.log(objS02)
console.log(objF02)
console.log(JSON.stringify(objF00) == JSON.stringify(objS00));
console.log(JSON.stringify(objF01) == JSON.stringify(objS01));
console.log(JSON.stringify(objF02) == JSON.stringify(objS02));