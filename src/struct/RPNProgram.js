const fs = require('fs');
const parser = require('../build/rpnlang');
const RPNError = require('./RPNError');
const { Evaluation, Lambda, LambdaCall } = require('./Evaluation');

class RPNProgram {
    constructor(text, { log = console.log, debug = false, safe = false } = {}) {
        this.text = text;
        this.log = log;
        this.debug = debug;
        this.safe = safe;

        try {
            this.statements = parser.parse(text);
        } catch (err) {
            if (this.debug) throw err;

            if (err.hash && err.hash.loc) {
                throw new RPNError('Syntax', `Unexpected token ${err.hash.token}`, err.hash.loc);
            }

            if (err.hash) {
                throw new RPNError('Syntax', 'Unrecognized token', {
                    last_line: err.hash.line + 1,
                    last_column: err.message.match(/\n(-*)\^$/)[1].length
                });
            }

            throw new RPNError('Syntax', 'Could not parse', {
                last_line: 0,
                last_column: 0
            });
        }

        this.variables = new Map();
    }

    setup() {
        const nan = (num, base = 10) => {
            if (typeof num === 'number') return false;

            let temp = parseInt(num, base);

            for (let i = num.length - 1; i; i--) {
                const res = parseInt(num.slice(0, i), base);
                if (temp === res) return true;
                temp = res;
            }

            return false;
        };

        const namespace = {
            G: 6.67408e-11,
            C: 299792458,
            GR: (1 + Math.sqrt(5)) / 2,
            TAU: Math.PI * 2,
            NAN: NaN,
            TRUE: true,
            FALSE: false,
            UNDEFINED: undefined,
            string: a => String(a),
            number: a => isNaN(a) ? NaN : Number(a),
            int: a => isNaN(a) ? NaN : Math.floor(Number(a)),
            base: (a, b) => nan(a, b) || isNaN(b) ? NaN : parseInt(a, Math.floor(Number(b))),
            nan: a => isNaN(a),
            nanbase: (a, b) => nan(a, b),
            sum: (...args) => args.reduce((t, a) => t + a),
            product: (...args) => args.reduce((t, a) => t * a),
            charcode: (a, b) => String(a).charCodeAt(Number(b)),
            fromcode: a => String.fromCharCode(a),
            random: a => Math.random() * a,
            length: a => a.length,
            type: a => {
                const type = typeof a;
                if (type === 'function') return 'native';
                if (type === 'object') return 'lambda';
                return type;
            },
            read: file => {
                if (this.safe) return undefined;

                try {
                    return fs.readFileSync(file, 'utf-8');
                } catch (err) {
                    return undefined;
                }
            },
            write: (file, data) => {
                if (this.safe) return false;

                try {
                    fs.writeFileSync(file, data, 'utf-8');
                    return true;
                } catch (err) {
                    return false;
                }
            }
        };

        Object.assign(namespace, Object.getOwnPropertyNames(Math).reduce((o, k) => {
            if (k === 'random') return o;
            o[k] = Math[k];
            return o;
        }, {}));

        for (const [key, value] of Object.entries(namespace)) {
            this.variables.set(key, value);
        }
    }

    inject(key, value) {
        this.variables.set(key, value);
        return this;
    }

    evaluate(statement) {
        const cases = {
            assign: this.evaluateAssign,
            print: this.evaluatePrint
        };

        const evaluation = new Evaluation(this, statement.expression).evaluate();
        cases[statement.type].call(this, evaluation, statement);
    }

    evaluateAssign(evaluation, statement) {
        if (statement.token === '=') {
            this.variables.set(statement.name, evaluation.stack[0]);
            return;
        }

        if (statement.token === '#=') {
            this.variables.set(statement.name, evaluation.stack);
        }
    }

    evaluatePrint(evaluation, statement) {
        if (statement.token === '>') {
            const value = this.clean(evaluation.stack[0]);
            this.log(value);
            return;
        }

        if (statement.token === '!') {
            const value = this.clean(evaluation.stack[0]);
            throw new RPNError('', value, statement.pos);
        }
    }

    clean(value) {
        return typeof value === 'object'
            ? { lambda: value.params }
            : typeof value === 'function'
                ? { lambda: value.length || Infinity }
                : value;
    }

    execute() {
        this.setup();
        for (const statement of this.statements) {
            try {
                this.evaluate(statement);
            } catch (err) {
                if (this.debug || err instanceof RPNError) throw err;

                if (err.message === 'Maximum call stack size exceeded') {
                    throw new RPNError('Range', 'Too much recursion', statement.pos);
                }

                if (err.message === 'Reduce of empty array with no initial value') {
                    throw new RPNError('Range', 'Not enough values', statement.pos);
                }

                throw err;
            }
        }
    }
}

RPNProgram.Evaluation = Evaluation;
RPNProgram.Lambda = Lambda;
RPNProgram.LambdaCall = LambdaCall;
RPNProgram.RPNError = RPNError;
module.exports = RPNProgram;
