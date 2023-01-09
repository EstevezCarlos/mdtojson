import fs from 'fs';


// const countTables = (md) => md
//   .split('\n')
//   .map((line) => line[0])
//   .join('')
//   .replace(/[^|]/g, ' ')
//   .split(' ')
//   .filter((x) => x)
//   .length;

const countTables = (md) => ((arr) => (arr === null ? 0 : arr.length))(md.match(/^\s*\|.*\|\s*$(?:(?:.|\n)*?)^\s*$/gm));

const ceilToPowOf10 = (i, pow = 0) => ((i < (10 ** pow)) ? pow : ceilToPowOf10(i, pow + 1));

const extractTablesAndHeaders = (md) => {
  const lines = md.split('\n');
  const tableNumberLength = ceilToPowOf10(countTables(md));
  const tables = {};
  let inTable = false;
  let currentTable = '';
  let currentHeader = '';
  let tableNumber = 1;
  lines.forEach((line) => {
    if (line.startsWith('|')) {
      inTable = true;
      currentTable += `${line}\n`;
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
      let safeHeader = currentHeader.replace(/#\s*/g, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      if (!currentHeader || Object.prototype.hasOwnProperty.call(tables, safeHeader)) {
        safeHeader = `table_${tableNumber.toString().padStart(tableNumberLength - 1, 0)}`;
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
  });
  return tables;
};

const tableToJson = (table, unpackTables = true) => {
  const rows = table.split('\n');
  const headers = rows[0].split('|').map((header) => header.trim());
  const data = [];

  for (let i = 2; i < rows.length - 1; i += 1) {
    const cells = rows[i].split('|').map((cell) => cell.trim());
    const rowData = {};
    for (let j = 0; j < cells.length; j += 1) {
      // if (!cells[j]) continue;
      if (cells[j]) rowData[headers[j]] = cells[j];
    }
    data.push(rowData);
  }
  if (unpackTables && data.length === 1) return data[0];
  return data;
};

export const mttj = {
  // Function takes markdow string and returns every table as JSON.
  // if there is no tables and silent == false, throws error
  // else if there is only one table, and unpack == true, returns processed table
  // else, return JSON containg multiple objects
  // each array containing only one lement is unpacked
  parseString(md, unpack = true, unpackTables = true, silent = true) {
    const uncommented = md.replace(/<!--[\s\S]*?-->/g, '');
    const tables = extractTablesAndHeaders(uncommented);
    const obj = {};
    Object.keys(tables).forEach((key) => { obj[key] = tableToJson(tables[key], unpackTables); });
    if (!silent && Object.keys(obj).length === 0) throw new Error('No tables to parse');
    if (unpack && Object.keys(obj).length === 1) return obj[Object.keys(obj)[0]];
    return obj;
  },
  // Function takes markdow file and returns every table as JSON.
  // if there is no tables and silent == false, throws error
  // else if there is only one table, and unpack == true, returns processed table
  // else, return JSON containg multiple objects
  // encoding and spread params are used by fs to read a file
  // each array containing only one lement is unpacked
  parseFileSync(file, unpack = true, unpackTables = true, silent = true, encoding = 'utf8', ...params) {
    const markdown = fs.readFileSync(file, encoding, ...params);
    return this.parseString(markdown, unpack, unpackTables, silent);
  },
};

export default mttj;
