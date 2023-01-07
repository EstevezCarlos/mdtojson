function roundUpToPowerOf10(number) {
  let power = 0;
  while (number >= 10 ** power) {
    power += 1;
  }
  return power;
}

function countTables(markdown) {
  let tableCount = 0;
  const lines = markdown.split('\n');
  let inTable = false;
  lines.forEach((line) => {
    if (line.startsWith('|')) {
      inTable = true;
    } else if (inTable && line.trim().length === 0) {
      inTable = false;
      tableCount += 1;
    }
  });
  return tableCount;
}

function extractTablesAndHeaders(markdown) {
  const lines = markdown.split('\n');
  const tableNumberLength = roundUpToPowerOf10(countTables(markdown));
  let inTable = false;
  let currentTable = '';
  const tables = {};
  let currentHeader = '';
  let tableNumber = 1;
  for (const line of lines) {
    if (line.startsWith('|')) {
      inTable = true;
      currentTable += `${line}\n`;
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
      let safeHeader;
      if (currentHeader) {
        safeHeader = currentHeader.replace(/#\s*/g, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      } else {
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

  // Loop through the rest of the rows
  for (let i = 1; i < rows.length; i++) {
    // Split the row on '|'
    const cells = rows[i].split('|').map(cell => cell.trim());

    // Create an object for the row data
    const rowData = {};

    // Add the data from each cell to the row object
    for (let j = 0; j < cells.length; j++) {
      rowData[headers[j]] = cells[j];
    }

    // Add the row object to the data array
    data.push(rowData);
  }

  // Return the data array
  return data;
}
