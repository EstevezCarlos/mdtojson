#!/usr/bin/env node

const fs		=	require('node:fs')
const mttj		=	require('../dist/app.js')
const strings	=	require('./strings.js')
const beautify	=	require('js-beautify')
const md_path	=	'./md/'


for (let i = 0; i < strings.md.length; i++) {

	console.log('--------------------------------')

	const padLength	=	strings.md.length.toString.length
	const ii		=	''.padStart(padLength, 0) + i
	const str_json	=	JSON.stringify(mttj.parseString(strings.md[i]))
	const file_json	=	JSON.stringify(mttj.parseFileSync(md_path + ii + '.md'))
	const beauty	=	beautify.js(str_json)

	console.log(`Test ${i}:`,str_json == file_json)
	console.log(`Writing log to: log/${ii}.json`)
	fs.writeFileSync(`log/${ii}.json`,beauty)

	console.log('--------------------------------')

	
}


const str_json	=	JSON.stringify(mttj.parseDirSync('./md/model'))
const beauty	=	beautify.js(str_json)
console.log(`Writing log to: log/model.json`)
fs.writeFileSync(`log/model.json`,beauty)