const RPNProgram = require('..');
module.exports = RPNProgram.makeModule({
    num: 5,
    arr: [1, 2, 3],
    joinString: (...args) => args.join(', '),
    map: (...args) => {
        const mapper = args[0];
        return args.slice(1).map(e => RPNProgram.callLambda(mapper, [e])[0]);
    }
});
