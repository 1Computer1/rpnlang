const RPNProgram = require('..');
module.exports = RPNProgram.makeModule({
    joinString: (...args) => args.join(', ')
});
