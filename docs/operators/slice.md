# Operators

## Slice

A slice operator has two main uses:  

- To slice parts of a variable where the stack is stored.
- To slice parts of the return value in a keep stack call.  

The fourth usage is to slice parts of a string.  

A slice takes one of these forms:  

- `[*, index]`
- `[*, from,]`
- `[*, from, to]`

Where `*` represents one of the two main uses (explained later) and `index`, `from`, and `to` are expressions which resolves to a number.  
The numbers can be positive or negative, where negative would mean from the end of the item.  
Note that if the values would be out-of-range, an error is thrown.  

## Variables

A slice for variables with stacks is in the form `$[name, ...]`.  

```
x #= 1 2 3;

// Prints [3]
< $[x, 0] [>];

// Prints [2, 1]
< $[x, 1,] [>];

// Prints [3, 2]
< $[x, 0, 2] [>];
```

The same can be done for rest lambdas.  

```
f = (...args) => ($[args, 0]);

// Prints [1]
< 1 2 3 $f@ [>];
```

If a variable does not hold a stack, an error is thrown.  

## Call

A slice can be used for when `#` is used to keep stack.  
This is in the form `#[@, ...]` or `#[$@, ...]`, depending if the recursion modifier is used.  

```
f = (n) => ($n 2 * $n 3 * $n 4 *);

// Prints [20, 15]
< 5 $f#[@, 0, 2] [>];
```

## Strings

Strings can be sliced by doing `[., ...]` (the token is a dot).  
This is different than the other usages since it works on a value rather than a stack.  

```
// Prints 'H'
> 'Hello' [., 0];
```
