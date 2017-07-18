const Program = require('./struct/Program');
module.exports = Program;

if (require.main === module) {
    const fs = require('fs');
    const args = require('minimist')(process.argv.slice(2));
    const text = args.code || args.c || fs.readFileSync(args._[0] || args.input || args.i, 'utf-8');
    new Program(text, {
        debug: args.debug || args.d,
        safe: args.safe || args.s
    }).execute();
}
