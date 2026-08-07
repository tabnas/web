import { Jsonic } from '@tabnas/jsonic'

// jsonic is a relaxed JSON — unquoted keys, implicit objects, comments,
// trailing commas. Already a usable config format.
console.log(JSON.stringify(Jsonic('a:1, b:{c:2}, d:[3,4]')))

// What it doesn't do is arithmetic: a value like 1+2 is just a string.
console.log(JSON.stringify(Jsonic('x: 1+2')))
