#!/usr/bin/env node
const mttj = require('../dist/app.js')



// #################### UNPACK ####################

// console.log(
//     '\n---------------- false ----------------\n',
//     mttj.parseFileSync('./md/01.md',{unpackTables:false}),
//     '\n------------ true (default) -----------\n',
//     mttj.parseFileSync('./md/01.md',{unpackTables:true})
// )



// ################ UNPACK TABLES ################

console.log(
    '\n---------------- false ----------------\n',
    mttj.parseFileSync('./md/02.md',{unpackTables:false}),
    '\n------------ true (default) -----------\n',
    mttj.parseFileSync('./md/02.md',{unpackTables:true})
)