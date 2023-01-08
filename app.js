// import fs from 'fs';
const fs = require('fs')

const roundUpToPowerOf10 = (number, power = 0) =>
  (number < (10 ** power))
    ? power :
    roundUpToPowerOf10(number, power + 1)

const countTables = markdown =>
  markdown
    .split('\n')
    .map(line => line[0])
    .join('')
    .replace(/[^|]/g, ' ')
    .split(' ')
    .filter(x => x)
    .length

const extractTablesAndHeaders = (markdown) => {
  const lines = markdown.split('\n');
  const tableNumberLength = roundUpToPowerOf10(countTables(markdown));
  const tables = {};
  let inTable = false;
  let currentTable = '';
  let currentHeader = '';
  let tableNumber = 1;
  for (const line of lines) {
    if (line.startsWith('|')) {
      inTable = true
      currentTable += `${line}\n`;
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
      let safeHeader = currentHeader.replace(/#\s*/g, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      if (!currentHeader || tables.hasOwnProperty(safeHeader)) {
        safeHeader = `table_${tableNumber.toString().padStart(tableNumberLength, 0)}`;
        tableNumber += 1;
      }
      tables[safeHeader] = currentTable;
      currentTable = '';
      currentHeader = '';
    } else if (!inTable && line.startsWith('#') && line.trim().length > 0) {
      currentHeader = line.trim();
    } else if (!inTable && line.trim().length > 0) {
      currentHeader = '';
    }
  }
  return tables;
}


const markdownTableToJson = (table) => {

  const rows = table.split('\n');
  const headers = rows[0].split('|').map(header => header.trim());
  const data = [];

  for (let i = 2; i < rows.length - 1; i++) {
    const cells = rows[i].split('|').map(cell => cell.trim());
    const rowData = {};
    for (let j = 0; j < cells.length; j++) {
      if (!cells[j]) continue;
      rowData[headers[j]] = cells[j];
    }
    data.push(rowData);
  }

  return data;
}

const mttj = {

  parseString(markdown) {
    const tables = extractTablesAndHeaders(markdown)
    const obj = {}
    for (const key in tables) obj[key] = markdownTableToJson(tables[key])
    return obj
  },

  parseFileSync(file, encoding = 'utf8', ...params) {
    const markdown = fs.readFileSync(file, encoding, ...params);
    return this.parseString(markdown)
  }
}
