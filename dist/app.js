const fs			=	require('node:fs')
const path			=	require('path')


const markdownIt	=	require('markdown-it')
const highlightjs	=	require('markdown-it-highlightjs')
const meta			=	require('markdown-it-meta')
const mdIt			=	markdownIt({breaks: true, html: true})
		.use(highlightjs, {inline:true})
		.use(meta)
const readMd		=	path => fs.existsSync(path) ? fs.readFileSync(path).toString() : '???'


const rmComments	=	(md)	=>	`\n${md.replace(/<!--[\s\S]*?-->/g, '').replace('<!--', '')}\n`
const countTables	=	(md)	=>	(arr => arr === null ? 0 : arr.length)(md.match(/^\s*\|.*\|\s*$(?:(?:.|\n)*?)^\s*$/gm));
const padLength		=	(i)		=>	i.toString.length



const applyRelations = (obj,k,v) => {
	
	const len	= k.length
	const ext	= k.slice(len-2)
	const key	= k.slice(0, len-2)
	const table	= `${key}s`

	if (ext != ' $')				return [k,v]
	if (len < 3)					return [k,v]
	if (!obj.hasOwnProperty(table))	return [k,v]
	console.log('key:',k,'\ttable: ',table,'\text:',ext)
	
	for (const row of obj[table]) {
		if (row.$ == v)				return [key,row]
		else console.log(`\t\t${row.$}`);
	}
	return [k,v]

}



const postprocessing = (obj, fun) => {
	for (const [_,table] of Object.entries(obj)) {
		for (const row of table) {
			for (const [k,v] of Object.entries(row)){

				[newK,newV] = fun(obj,k,v)
				row[newK] = newV
				if (newK != k) delete row[k] 

			}
		}
	}
}



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

const compileInlines = [
	text	=>	text.replace(	/\[([^\[]+)\]\(([^\)]+)\)/g,	'<a href="$2">$1</a>'	)
	,text	=>	text.replace(	/\*\*([^*]+)\*\*/g,				'<strong>$1</strong>'	)
	,text	=>	text.replace(	/\*([^*]+)\*/g,					'<em>$1</em>'			)
	,text	=>	text.replace(	/`([^`]+)`/g,					'<code>$1</code>'		)
	,text	=>	text.replace(	/~~([^~]+)~~/g, 				'<del>$1</del>'			)
]


// const injectItemToRow = (row,item) => {
// 	const {k,v} = item
// 	if (!row.hasOwnProperty(k)) row[k] == v
// }
const findRowI = (table,$) => {
	console.log(table);
	if (!table[0].hasOwnProperty('$')) return
	for (let i = 0; i < table.length; i++) {
		if(table[i].$ == $)	return i
	}
	return
}

// const findTable = (obj,k) => {
// 	return obj[k]
// }



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
		const { unpack, unpackTables, strict,rawInlines } = { ...this.defaultFlags, ...flags }
		const uncommented = rmComments(md)
		const compiledInlines = !rawInlines ? λ(uncommented,...compileInlines) : uncommented
		const tables = extractTablesAndHeaders(compiledInlines)
		const obj = {}
		Object.keys(tables).forEach((key) => { obj[key] = tableToJson(tables[key], unpackTables) })
		if (strict && Object.keys(obj).length === 0) throw new Error('No tables to parse')
		if (unpack && Object.keys(obj).length === 1) return obj[Object.keys(obj)[0]]
		if (true) postprocessing(obj, applyRelations)
		return obj
	}



	// Function takes markdow file and returns every table as JSON.
	// if there is no tables and silent == false, throws error
	// else if there is only one table, and unpack == true, returns processed table
	// else, return JSON containg multiple objects
	// encoding and spread params are used by fs to read a file
	// each array containing only one element is unpacked
	,parseFileSync(file, flags, encoding = 'utf8', ...params) {
		flags = { ...this.defaultFlags, ...flags }
		const markdown = fs.readFileSync(file, encoding, ...params)
		return this.parseString(markdown, flags)
	}


	//Description
	,parseDirSync(dir, flags, encoding = 'utf8', ...params){
		flags			= { ...this.defaultFlags, ...flags }
		const markdown	= fs.readFileSync(`${dir}/$.md`, encoding, ...params)
		const files		= fs.readdirSync(dir)
		let obj			= {};
		for (const outDir of files) {
			if (outDir == '$.md'){
				const localObj = this.parseFileSync(`${dir}/$.md`, flags)
				obj = {...localObj, ...obj}
			}







			else {

				const outPath = `${dir}/${outDir}`
				if (fs.lstatSync(outPath).isDirectory()) {

					// console.log(outDir)
					for (const inDir of fs.readdirSync(outPath)) {
				
						// console.log('\t',inDir)
						const inPath = `${outPath}/${inDir}`
						if (fs.lstatSync(inPath).isDirectory())
						for (const file of fs.readdirSync(inPath)) {
							if (file.endsWith('.md')){
								const fileName = path.parse(file).name
								const corePath = `${inPath}/${file}`
								// console.log(`\t\t${fileName}`);
								// console.log('obj:',obj);
								// console.log('outDir:',outDir);
								// console.log(`obj[outDir]: ${obj[outDir]}`);
								const i = findRowI(obj[outDir],inDir)
								obj[outDir][i][fileName] = mdIt.render(readMd(corePath))
							}
						}

					}
				}
			}









		}
		// let ret = markdown
		// for (const f of files) {
		// 	if (f.endsWith('.md') && key != '$') {
		// 		ret += `${key}: ${md.render(readMd(f))}`
		// 	}
		// 	if (f.isDirectory()) {
		// 		ret += this.parseDirSync(f)
		// 	}
		// }
		if (true) postprocessing(obj, applyRelations)
		return obj
	}
}


module.exports = mttj