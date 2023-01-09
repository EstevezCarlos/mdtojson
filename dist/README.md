# MTTJ
**M**arkdown **T**able **T**o **J**SON

## What does it do?
MTTJ takes markdown file or script and convert it to JavaScript object.

## Why?
Because sometimes replicability is more important than scalability.
Not every web app needs to be big.
Not every company needs to maintain database.

## To do..
- create async file read method
- create filter method
- make optional type interpretation

## Patch Notes
v 0.1.9
- Comments `<!--  -->` are removed before processing
- By default markdown with single table is unpacked
- By default table with single row is unpacked
- Fixed some minor bugs
