import mdToJson from "./app.js";
import fs from 'fs';

const markdown = fs.readFileSync('file.md', 'utf8');
let tables = mdtojson.parseString(markdown)
console.log(tables)

