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


export function markdownTableToJson(table) {
  // Split the table into rows
  const rows = table.split('\n');

  // Get the headers by splitting the first row on '|'
  const headers = rows[0].split('|').map(header => header.trim());

  // Create an array to hold the data
  const data = [];

  // Loop through the rest of the rows, starting at the third row (index 2)
  for (let i = 2; i < rows.length -1; i++) {
    // Split the row on '|'
    const cells = rows[i].split('|').map(cell => cell.trim());

    // Create an object for the row data
    const rowData = {};

    // Add the data from each cell to the row object
    for (let j = 0; j < cells.length; j++) {
      // Skip empty cells
      if (!cells[j]) continue;

      rowData[headers[j]] = cells[j];
    }

    // Add the row object to the data array
    data.push(rowData);
  }

  // Return the data array
  return data;
}

export const mdToJson = {

  parseString(markdown) {
    const tables =extractTablesAndHeaders(markdown)
    const obj =  {}
    for (const key in tables) {
      obj[key] = tables[key]
    }
    return obj
  },
  
  parseFile(file){
    
  }
}

export default mdToJson