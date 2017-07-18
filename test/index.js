const fs = require('fs');
const Program = require('../src/index.js');

const text = fs.readFileSync('test/test.rpn', 'utf-8');
const program = new Program(text);

console.log('--- SOURCE ---');
console.log(text);
console.log('--- RESULT ---');
program.execute();
