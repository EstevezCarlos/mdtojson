import mdToJson from "./app.js";
import fs from 'fs';


const markdown = fs.readFileSync('file.md', 'utf8');
console.log(mdToJson.parseString(markdown))
console.log(mdToJson.parseFileSync('file.md'))

