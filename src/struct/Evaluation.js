const readlineSync = require('readline-sync');
const RPNError = require('./RPNError');

class Evaluation {
    constructor(program, expression) {
        Object.defineProperty(this, 'program', { value: program });

        this.expression = expression;
        this.stack = [];
    }

    evaluate() {
        for (const item of this.expression) {
            if (item === undefined) continue;
            if (typeof item === 'object') {
                if (Array.isArray(item) && !item.length) {
                    continue;
                }

                const cases = {
                    operator: this.evaluateOperator,
                    get: this.evaluateGet,
                    lambda: this.evaluateLambda,
                    call: this.evaluateCall,
                    branch: this.evaluateBranch,
                    cases: this.evaluateCases,
                    stack: this.evaluateStack,
                    index: this.evaluateIndex,
                    iterate: this.evaluateIterate
                };

                cases[item.type].call(this, item);
                continue;
            }

            this.stack.unshift(item);
        }

        return this;
    }

    runInline(expression) {
        const Constructor = this instanceof LambdaCall ? LambdaCall.bind(null, this.lambda, this.args) : Evaluation.bind(null, this.program);
        const evaluation = new Constructor();
        evaluation.expression = expression;
        return evaluation.evaluate().stack;
    }

    createLambda(item) {
        if (this instanceof LambdaCall) {
            const closure = new Map();

            for (const [key, value] of this.lambda.closure.entries()) {
                closure.set(key, value);
            }

            for (const [key, value] of this.args.entries()) {
                closure.set(key, value);
            }

            const lambda = new Lambda(this.program, item.params, item.expression, closure);
            return lambda;
        }

        const lambda = new Lambda(this.program, item.params, item.expression);
        return lambda;
    }

    createSlice(item, toSlice, dry) {
        let from = Number(this.runInline(item.slice.from || item.slice.index)[0]);
        if (isNaN(from)) {
            throw new RPNError('Type', 'Value not a number', item.pos);
        }

        if (from < 0) from = toSlice.length + from;
        if (from < 0 || from > toSlice.length) {
            throw new RPNError('Range', 'Value out of range for operation', item.pos);
        }

        let to;
        if (item.slice.to) {
            to = Number(this.runInline(item.slice.to)[0]);
            if (isNaN(to)) {
                throw new RPNError('Type', 'Value not a number', item.pos);
            }

            if (to < 0) to = toSlice.length + to;
            if (to < 0 || to > toSlice.length) {
                throw new RPNError('Range', 'Value out of range for operation', item.pos);
            }
        }

        if (dry) {
            if (item.slice.index) return [from, from + 1];
            return [from, item.slice.to ? to : toSlice.length];
        }

        if (item.slice.index) return toSlice.slice(from, from + 1);
        return toSlice.slice(from, item.slice.to ? to : toSlice.length);
    }

    iterateOnStack(item) {
        if (item.lambda.params.length !== 2) {
            throw new RPNError('Range', 'Iterate function requires 2 params', item.pos);
        }

        if (item.condition && item.condition.params.length !== 2) {
            throw new RPNError('Range', 'Condition function requires 2 params', item.pos);
        }

        const length = this.stack.length;
        const lambda = this.createLambda(item.lambda);
        const condition = item.condition ? this.createLambda(item.condition) : null;

        const res = [];

        for (let i = 0; i < length; i++) {
            const e = this.stack.shift();
            const val = lambda.call(new Map([
                [lambda.params[0], e],
                [lambda.params[1], i]
            ]));

            if (item.token === '&') {
                res.push(val);
            } else
            if (item.token === '|') {
                if (val) res.push(e);
            }

            if (condition) {
                if (condition.call(new Map([
                    [lambda.params[0], val],
                    [lambda.params[1], i]
                ]))) {
                    break;
                }
            }
        }

        return res;
    }

    iterateInPlace(item) {
        if (item.lambda.params.length !== 1) {
            throw new RPNError('Range', 'Iterate function requires 1 param', item.pos);
        }

        if (item.condition && item.condition.params.length !== 2) {
            throw new RPNError('Range', 'Condition function requires 2 params', item.pos);
        }

        const lambda = this.createLambda(item.lambda);
        const condition = item.condition ? this.createLambda(item.condition) : null;

        const res = [];
        let i = 0;
        let go = true;

        while (go) {
            const val = lambda.call(new Map([
                [lambda.params[0], i]
            ]));

            if (item.token === '&') {
                res.push(val);
            } else
            if (item.token === '|') {
                if (val) res.push(val);
            }

            if (condition) {
                if (condition.call(new Map([
                    [condition.params[0], val],
                    [condition.params[1], i]
                ]))) {
                    go = false;
                }
            } else {
                go = false;
            }

            i++;
        }

        return res;
    }

    evaluateOperator(item) {
        const func = {
            '!': a => !a,
            '?': a => !!a,
            '~': a => ~a,
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '%': (a, b) => a % b,
            '&': (a, b) => a & b,
            '|': (a, b) => a | b,
            '^': (a, b) => a ^ b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '==': (a, b) => a === b,
            '!=': (a, b) => a !== b,
            '>>': (a, b) => a >> b,
            '<<': (a, b) => a << b,
            '//': (a, b) => Math.floor(a / b),
            '**': (a, b) => a ** b,
            '&&': (a, b) => a && b,
            '||': (a, b) => a || b,
            '>>>': (a, b) => a >>> b
        }[item.token];

        if (this.stack.length < func.length) {
            throw new RPNError('Range', 'Invalid amount of arguments', item.pos);
        }

        const args = this.stack.splice(0, func.length || Infinity);
        const res = func(...args.reverse());

        this.stack.unshift(res);
    }

    evaluateGet(item) {
        if (item.module) {
            if (item.module !== true && !this.program.imports.has(item.module)) {
                throw new RPNError('Name', `Module ${item.module} is not imported`, item.pos);
            }

            const source = item.module === true ? this.program.exports : this.program.imports.get(item.module);

            if (!source.has(item.name)) {
                throw new RPNError('Name', `${item.name} is not defined`, item.pos);
            }

            const val = source.get(item.name);

            if (item.token === '$...') {
                if (!Array.isArray(val)) {
                    throw new RPNError('Range', 'Cannot spread non-rest value', item.pos);
                } else {
                    const slice = this.createSlice(item, val);
                    this.stack.unshift(...slice);
                    return;
                }
            }

            if (Array.isArray(val)) {
                this.stack.unshift(...val);
            } else {
                this.stack.unshift(val);
            }

            return;
        }

        if (this.program.variables.has(item.name)) {
            const val = this.program.variables.get(item.name);

            if (item.token === '$...') {
                if (!Array.isArray(val)) {
                    throw new RPNError('Range', 'Cannot spread non-rest value', item.pos);
                } else {
                    const slice = this.createSlice(item, val);
                    this.stack.unshift(...slice);
                    return;
                }
            }

            if (Array.isArray(val)) {
                this.stack.unshift(...val);
            } else {
                this.stack.unshift(val);
            }

            return;
        }

        if (this instanceof LambdaCall) {
            let val;

            if (this.lambda.params.includes(item.name)) {
                val = this.args.get(item.name);
            } else
            if (this.lambda.closure.has(item.name)) {
                val = this.lambda.closure.get(item.name);
            }

            if (item.token === '$...') {
                if (!Array.isArray(val)) {
                    throw new RPNError('Range', 'Cannot spread non-rest value', item.pos);
                } else {
                    const slice = this.createSlice(item, val);
                    this.stack.unshift(...slice);
                    return;
                }
            }

            if (Array.isArray(val)) {
                this.stack.unshift(...val);
            } else {
                this.stack.unshift(val);
            }

            return;
        }

        throw new RPNError('Name', `${item.name} is not defined`, item.pos);
    }

    evaluateLambda(item) {
        const lambda = this.createLambda(item);
        this.stack.unshift(lambda);

        if (item.call) {
            this.evaluateCall(item.call);
        }
    }

    evaluateCall(item) {
        const keep = item.token.includes('#');
        let lambda;

        if (item.token.includes('$@')) {
            if (!(this instanceof LambdaCall)) {
                throw new RPNError('Type', 'Context is not callable', item.pos);
            }

            lambda = this.lambda;
        } else {
            if (!(this.stack[0] instanceof Lambda) && typeof this.stack[0] !== 'function') {
                throw new RPNError('Type', 'Value is not callable', item.pos);
            }

            lambda = this.stack.shift();
        }

        if (typeof lambda === 'function') {
            if (this.stack.length < lambda.length) {
                throw new RPNError('Range', 'Invalid amount of arguments', item.pos);
            }

            const args = this.stack.splice(0, lambda.length || Infinity);
            const res = lambda(...args.reverse());

            this.stack.unshift(res);
            return;
        }

        if (lambda.params.rest ? false : this.stack.length < lambda.params.length) {
            throw new RPNError('Range', 'Invalid amount of arguments', item.pos);
        }

        let res;

        if (!lambda.params.rest) {
            const args = new Map();
            for (const [i, arg] of this.stack.splice(0, lambda.params.length).reverse().entries()) {
                args.set(lambda.params[i], arg);
            }

            res = lambda.call(args, keep);
        } else {
            const args = new Map([[lambda.params[0], this.stack.splice(0, Infinity).reverse()]]);
            res = lambda.call(args, keep);
        }

        if (item.slice) {
            if (!Array.isArray(res)) {
                throw new RPNError('Range', 'Cannot spread non-rest value', item.pos);
            } else {
                const slice = this.createSlice(item, res);
                this.stack.unshift(...slice);
                return;
            }
        }

        if (Array.isArray(res)) {
            this.stack.unshift(...res);
        } else {
            this.stack.unshift(res);
        }
    }

    evaluateBranch(item) {
        if (!this.stack.length) {
            throw new RPNError('Range', 'Cannot branch on no value', item.pos);
        }

        if (this.stack.shift()) {
            const res = this.runInline(item.yes);
            this.stack.unshift(...res);
        } else
        if (item.no) {
            const res = this.runInline(item.no);
            this.stack.unshift(...res);
        }
    }

    evaluateCases(item) {
        let expression;
        for (const entry of item.cases) {
            if (this.runInline(entry.condition)[0]) {
                expression = entry.yes;
                break;
            }
        }

        if (expression) {
            const res = this.runInline(expression);
            this.stack.unshift(...res);
        }
    }

    evaluateStack(item) {
        if (item.token === '?') {
            this.stack.unshift(this.stack.length);
            return;
        }

        const [from, to] = item.slice
            ? this.createSlice(item, this.stack, true)
            : this.createSlice({
                slice: {
                    from: [0],
                    to: [1]
                },
                pos: item.pos
            }, this.stack, true);

        const cases = {
            '>': () => {
                if (!item.slice) {
                    const values = this.stack.map(value => this.program.clean(value));
                    this.program.log(values);
                    return;
                }

                if (item.slice.index) {
                    this.program.log(this.stack[from]);
                    return;
                }

                const values = this.stack.slice(from, to).map(value => this.program.clean(value));
                this.program.log(values);
            },
            '<': () => {
                const text = item.slice ? this.stack.splice(from, to - from).join(' ') : '';

                if (this.program.safe) {
                    this.stack.unshift('');
                    return;
                }

                this.stack.unshift(readlineSync.question(text));
            },
            '+': () => {
                const values = this.stack.slice(from, to);
                this.stack.unshift(...values);
            },
            '-': () => {
                this.stack.splice(from, to - from);
            },
            '&': () => {
                const values = this.stack.splice(from, to - from);
                this.stack.unshift(...values);
            },
            '@': () => {
                if (this.stack.length < 2) {
                    throw new RPNError('Range', 'Not enough values', item.pos);
                }

                if (item.slice) {
                    if (item.slice.index) {
                        [this.stack[0], this.stack[from]] = [this.stack[from], this.stack[0]];
                        return;
                    }

                    if (item.slice.from && !item.slice.to) {
                        [this.stack[this.stack.length - 1], this.stack[from]] = [this.stack[from], this.stack[this.stack.length - 1]];
                        return;
                    }
                }

                [this.stack[from], this.stack[to]] = [this.stack[to], this.stack[from]];
            },
            '!': () => {
                if (!item.slice) {
                    const values = this.stack.map(value => this.program.clean(value));
                    throw new RPNError('', `[${values.join(', ')}]`, item.pos);
                }

                if (item.slice.index) {
                    throw new RPNError('', this.stack[from], item.pos);
                }

                const values = this.stack.slice(from, to).map(value => this.program.clean(value));
                throw new RPNError('', `[${values.join(', ')}]`, item.pos);
            },
            '%': () => {
                if (item.slice) {
                    const rev = this.stack.slice(from, to);
                    const rest = this.stack.slice(to);
                    this.stack = rev.reverse().concat(rest);
                    return;
                }

                this.stack = this.stack.reverse();
            }
        };

        cases[item.token]();
    }

    evaluateIndex(item) {
        if (typeof this.stack[0] !== 'string') {
            throw new RPNError('Type', 'Cannot get an index of value', item.pos);
        }

        const slice = this.createSlice(item, this.stack.shift());
        this.stack.unshift(slice);
    }

    evaluateIterate(item) {
        if (item.mode === '#') {
            this.stack.unshift(...this.iterateOnStack(item));
            return;
        }

        if (item.mode === '@') {
            this.stack.unshift(...this.iterateInPlace(item));
        }
    }
}

class LambdaCall extends Evaluation {
    constructor(lambda, args) {
        super(lambda.program, lambda.expression);
        this.lambda = lambda;
        this.args = args;
    }
}

class Lambda {
    constructor(program, params, expression, closure = new Map()) {
        Object.defineProperty(this, 'program', { value: program });

        this.params = params;
        this.closure = closure;
        this.expression = expression;
    }

    call(args, keep) {
        const call = new LambdaCall(this, args).evaluate();
        return keep ? call.stack : call.stack[0];
    }
}

module.exports = {
    Evaluation,
    Lambda,
    LambdaCall
};
