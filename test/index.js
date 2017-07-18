const fs = require('fs');
const RPNProgram = require('../src/index.js');

const text = fs.readFileSync('test/test.rpn', 'utf-8');
const program = new RPNProgram(text);

console.log('--- SOURCE ---');
console.log(text);
console.log('--- RESULT ---');
program.execute();
