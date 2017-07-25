const RPNProgram = require('../struct/RPNProgram');

module.exports = () => RPNProgram.makeModule({
    split: a => String(a).split(''),
    splitby: (a, b) => String(a).split(String(b)),
    charcode: (a, b) => String(a).charCodeAt(Number(b)),
    fromcode: a => String.fromCharCode(Number(a)),
    upper: a => String(a).toUpperCase(),
    lower: a => String(a).toLowerCase(),
    repeat: (a, b) => String(a).repeat(Number(b))
});
