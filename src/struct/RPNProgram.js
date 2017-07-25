const fs = require('fs');
const path = require('path');
const parser = require('../build/rpnlang');
const RPNError = require('./RPNError');
const Evaluation = require('./Evaluation');
const moduleSymbol = Symbol('rpnModule');

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
        this.exports = new Map();
        this.imports = new Map();
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
            length: a => a.length,
            type: a => {
                const type = typeof a;
                if (type === 'function') return 'native';
                if (type === 'object') return 'lambda';
                return type;
            },
            sum: (...args) => args.reduce((t, a) => t + a),
            product: (...args) => args.reduce((t, a) => t * a)
        };

        for (const [key, value] of Object.entries(namespace)) {
            this.variables.set(key, value);
        }
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

        if (statement.token === '#') {
            this.variables.set(statement.name, evaluation.stack);
            return;
        }

        if (statement.token === '<<') {
            if (/^stdlib\[(\w+)\]$/.test(evaluation.stack[0])) {
                const [, libName] = evaluation.stack[0].match(/^stdlib\[(\w+)\]$/);

                try {
                    const lib = require(`../stdlib/${libName}.js`);
                    this.imports.set(statement.name, lib(this).exports);
                    return;
                } catch (err) {
                    throw new RPNError('Module', `Could not import ${filepath}`, statement.pos);
                }
            }

            let filepath = path.resolve(evaluation.stack[0]);

            if (this.safe) {
                throw new RPNError('Module', `Could not import ${filepath}`, statement.pos);
            }

            if (this.imports.has(statement.name)) {
                throw new RPNError('Module', 'Cannot reassign an imported module', statement.pos);
            }

            if (path.extname(filepath) === '.js') {
                const js = require(filepath);

                if (typeof js !== 'object' && !js[moduleSymbol]) {
                    delete require.cache[require.resolve(filepath)];
                    throw new RPNError('Module', `Could not import ${filepath}`, statement.pos);
                }

                this.imports.set(statement.name, js.exports);
                return;
            }

            if (!path.extname(filepath)) {
                filepath += '.rpn';
            }

            let text;

            try {
                text = fs.readFileSync(filepath, 'utf-8');
            } catch (err) {
                throw new RPNError('Module', `Could not import ${filepath}`, statement.pos);
            }

            const program = new RPNProgram(text, {
                log: this.log,
                debug: this.debug,
                safe: this.safe
            });

            program.execute();
            this.imports.set(statement.name, program.exports);
            return;
        }

        if (statement.token === '>>') {
            if (this.exports.has(statement.name)) {
                throw new RPNError('Module', 'Cannot reassign an exported value', statement.pos);
            }

            this.exports.set(statement.name, evaluation.stack[0]);
            return;
        }

        if (statement.token === '#>') {
            if (this.exports.has(statement.name)) {
                throw new RPNError('Module', 'Cannot reassign an exported value', statement.pos);
            }

            this.exports.set(statement.name, evaluation.stack);
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

    static makeModule(obj) {
        if (typeof obj !== 'object') throw new TypeError('Must be an object');
        if (Object.values(obj).some(a => !this.isValue(a))) throw new TypeError('Invalid export (not primitive or array containing only primitives)');

        return {
            _exports: obj,
            exports: new Map(Object.entries(obj)),
            [moduleSymbol]: true
        };
    }

    static callLambda(lambda, args) {
        if (lambda.params.length !== args.length) throw new RangeError('Invalid amount of arguments for lambda');
        if (args.some(a => !this.isValue(a))) throw new TypeError('Invalid value passed in (not primitive or array containing only primitives)');
        const argsMap = new Map();
        for (const [i, param] of lambda.params.entries()) {
            argsMap.set(param, args[i]);
        }

        return lambda.call(argsMap, true);
    }

    static isValue(value) {
        if (Array.isArray(value)) {
            for (const item of value) {
                if (Array.isArray(item)) return false;
                if (!this.isValue(item)) return false;
            }

            return true;
        }

        return ['string', 'number', 'boolean', 'undefined', 'function'].includes(typeof value);
    }
}

module.exports = RPNProgram;
