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


const md03 = `
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
`;

const md03b = `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |`;

const md03c = `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |<!--`;

const md04 = `# Header

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
`;

const objF00 = mttj.parseFileSync('./test/00.md')
const objF01 = mttj.parseFileSync('./test/01.md')
const objF02 = mttj.parseFileSync('./test/02.md')
const objF03 = mttj.parseFileSync('./test/03.md')
const objF03c = mttj.parseFileSync('./test/03c.md')
const objF04 = mttj.parseFileSync('./test/04.md')
const objS00 = mttj.parseString(md00)
const objS01 = mttj.parseString(md01)
const objS02 = mttj.parseString(md02)
const objS03 = mttj.parseString(md03)
const objS03b = mttj.parseString(md03b)
const objS03c = mttj.parseString(md03c)
const objS04 = mttj.parseString(md04)
// console.log('objS00:', objS00)
// console.log('objS01:', objS01)
// console.log('objS02:', objS02)
// console.log('objS03:', objS03)
// console.log('objS03b:', objS03b)
// console.log('objS03c:', objS03c)
// console.log('objF00:', objF00)
// console.log('objF01:', objF01)
// console.log('objF02:', objF02)
// console.log('objF03:', objF03)
// console.log('objF03c:', objF03c)
console.log('objF04:', objF04)
// console.log(JSON.stringify(objF00) == JSON.stringify(objS00));
// console.log(JSON.stringify(objF01) == JSON.stringify(objS01));
// console.log(JSON.stringify(objF02) == JSON.stringify(objS02));
// console.log(JSON.stringify(objF03) == JSON.stringify(objS03));
console.log(JSON.stringify(objF03) == JSON.stringify(objS03b));
console.log(JSON.stringify(objF03c) == JSON.stringify(objS03c));
console.log(JSON.stringify(objF04) == JSON.stringify(objS04));