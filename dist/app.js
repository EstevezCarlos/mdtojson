const fs = require('node:fs')

const rmComments	=	(md)	=>	`\n${md.replace(/<!--[\s\S]*?-->/g, '').replace('<!--', '')}\n`
const countTables	=	(md)	=>	(arr => arr === null ? 0 : arr.length)(md.match(/^\s*\|.*\|\s*$(?:(?:.|\n)*?)^\s*$/gm));
const padLength		=	(i)		=>	i.toString.length

const extractTablesAndHeaders = (md) => {
	const lines = md.split('\n')
	const tableNumberLength = padLength(countTables(md));
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
		if (cells[j]) rowData[headers[j]] = cells[j];
	}
	data.push(rowData);
	}
	if (unpackTables && data.length === 1) return data[0];
	return data;
};

const λ = ( variable, ...funs ) => {
	let out = variable
	for (const fun of funs) {
		out = fun(out)
	}
	return out
}

const compile_inlines = [
	text	=>	text.replace(	/\[([^\[]+)\]\(([^\)]+)\)/g,	'<a href="$2">$1</a>'	)
	,text	=>	text.replace(	/\*\*([^*]+)\*\*/g,				'<strong>$1</strong>'	)
	,text	=>	text.replace(	/\*([^*]+)\*/g,					'<em>$1</em>'			)
	,text	=>	text.replace(	/`([^`]+)`/g,					'<code>$1</code>'		)
	,text	=>	text.replace(	/~~([^~]+)~~/g, 				'<del>$1</del>'			)
]




const mttj = {
	defaultFlags: {
		unpack:			false,
		unpackTables:	false,
		strict:			false,
		rawInlines:		false
	}
	// Function takes markdow string and returns every table as JSON.
	// if there is no tables and silent == false, throws error
	// else if there is only one table, and unpack == true, returns processed table
	// else, return JSON containg multiple objects
	// each array containing only one element is unpacked
	,parseString(md, flags) {
		const { unpack, unpackTables, strict,rawInlines } = { ...this.defaultFlags, ...flags };
		const uncommented = rmComments(md);
		const compiledInlines = !rawInlines ? λ(uncommented,...compile_inlines) : uncommented
		const tables = extractTablesAndHeaders(compiledInlines);
		const obj = {};
		Object.keys(tables).forEach((key) => { obj[key] = tableToJson(tables[key], unpackTables); });
		if (strict && Object.keys(obj).length === 0) throw new Error('No tables to parse');
		if (unpack && Object.keys(obj).length === 1) return obj[Object.keys(obj)[0]];
		return obj;
	}
	// Function takes markdow file and returns every table as JSON.
	// if there is no tables and silent == false, throws error
	// else if there is only one table, and unpack == true, returns processed table
	// else, return JSON containg multiple objects
	// encoding and spread params are used by fs to read a file
	// each array containing only one element is unpacked
	,parseFileSync(file, flags, encoding = 'utf8', ...params) {
		flags = { ...this.defaultFlags, ...flags };
		const markdown = fs.readFileSync(file, encoding, ...params);
		return this.parseString(markdown, flags);
	},
};


module.exports = mttj