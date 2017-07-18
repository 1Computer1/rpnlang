# RPNLang

A dynamically-typed, RPN-based, and stack-based esoteric language.  

```
> 'Hello World!'; // Hello World!
> 1 1 + 2 2 + -; // -2

x = 5;
< 1 2 3 $x [>]; // [5, 3, 2, 1]

adder = (a) => (
    (b) => $a $b +
);

> 3 5 $adder@@; // 8

is_prime = (num) => (
    $num $sqrt@ $floor@ 2 (sqnum, i) => ({
        $num $i % 0 == : $!?,
        $i $sqnum >= : $num 1 !=,
        $!! : $sqnum $i 1 + $@
    })@
);

> 1231 $is_prime@; // true
```

## Language

See the explanation for the language at the [documentations](./docs/README.md).  
Note that it is not a guide but rather just the syntax and operators.  

## API

RPNLang is interpreted with JavaScript.  
You can require the module and run code:  

```js
const RPNProgram = require('rpnlang');

const program = new RPNProgram('> 1 1 +;');
program.execute(); // 2
```

If you wish to add your own JavaScript objects into RPNLang, use `inject()`.  
You can also interact with RPNLang's objects using `RPNProgram.Evaluation`, `RPNProgram.Lambda`, `RPNProgram.LambdaCall`, or `RPNProgram.RPNError`.  

Note that you will have to do many of the safety checks yourself in order to not cause errors from JavaScript.  
Variables can be accessed using `program.variables`.  

```js
const RPNProgram = require('rpnlang');

new RPNProgram('> $custom;')
    .inject('custom', 50)
    .execute(); // 50

new RPNProgram('> (n) => ($n 1 +) $call_with_5@;')
    .inject('call_with_5', lambda => {
        return lambda.call(new Map([
            [lambda.params[0], 5]
        ]));
    })
    .execute(); // 6
```

#### `RPNProgram(source[, options])`

- `source` - The source code.
- `options.log` - Function for standard output.
- `options.debug` - Debug mode, prints more errors.
- `options.safe` - Disables file I/O and stdin.

## CLI

You can also run a file via the CLI:  

```
$ rpn input_file.rpn
```

#### `Flags`

- `-c [code]` - Runs code.
- `-d` - Enables debug mode.
- `-s` - Enables safe mode.

## Other

RPNLang is made purely for fun, don't take it too seriously!  
Created with [jison](http://zaa.ch/jison/).  
