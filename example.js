import mdToJson from "./app.js";
// import fs from 'fs';

// const markdown = fs.readFileSync('file.md', 'utf8');
// let tables = mdToJson.parseString(markdown)
let tables = mdToJson.parseFileSync('file.md')
console.log(tables)

