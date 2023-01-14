#!/usr/bin/env node

const fs		=	require('node:fs')
const mttj		=	require('../dist/app.js')
const strings	=	require('./strings.js')
const beautify	=	require('js-beautify')
const md_path	=	'./md/0'


for (let i = 0; i < strings.md.length; i++) {
	const str_json	=	JSON.stringify(mttj.parseString(strings.md[i]))
	const file_json	=	JSON.stringify(mttj.parseFileSync(md_path + i + '.md'))
	const beauty	=	beautify.js(str_json)

	console.log(`Test ${i}:`,str_json == file_json)
	fs.writeFileSync(`log/${i}.json`,beauty)
	
}



// console.log(
// 	'\n---------------- false ----------------\n',
// 	mttj.parseString(md01,{unpack:false}),
// 	'\n------------ true (default) -----------\n',
// 	mttj.parseString(md01,{unpack:true})
// )