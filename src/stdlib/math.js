const RPNProgram = require('../struct/RPNProgram');

const namespace = {
    G: 6.67408e-11,
    C: 299792458,
    GR: (1 + Math.sqrt(5)) / 2,
    TAU: Math.PI * 2
};

Object.assign(namespace, Object.getOwnPropertyNames(Math).reduce((o, k) => {
    if (k === 'random') {
        o[k] = function random(max) {
            return Math.random() * Number(max);
        };

        return o;
    }

    o[k] = Math[k];
    return o;
}, {}));

module.exports = () => RPNProgram.makeModule(namespace);
