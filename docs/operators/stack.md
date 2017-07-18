# Operators

## Stack

Stack operators works on the stack.  
Stack operators are in the form `[*, ...]` where `*` is one of the operators below.  
It is syntactically similar to the slice operator, but does not necessarily slice.  

## Length

Operator: `[?]`  
Gets the length of the stack.  
Does not consume any values.  

This operator is a special case since the index portion of the syntax is ignored and not evaluated.  

```
// Prints 5
> 10 32 43 12 1 [?];
```

## Print

Operator: `[>]`  
Prints value(s) in the stack.  
Does not consume any values.  

If used in the form `[>, index]`, that specific value is printed.  
If used in the form `[>, from,]` or `[>, from, to]`, those values are printed.  

```
// Prints 5
< 2 1 5 [>, 0];

// Prints [5, 1, 2]
< 2 1 5 [>];

// Prints [5, 1]
< 1 5 [>, 0, 2];
```

## Error

Operator: `[!]`  
Prints value(s) in the stack.  
Does not consume any values.  

Works the same as the print operator, but throws an error instead.  

## Input

Operator: `[<]`  
Takes input from stdin.  
May consume values.  

If used in the form `[<]`, no values are consumed.  
If used in other forms, those values are consumed and printed.  

```
// Whatever you want, plus 1
> [<] $int@ 0 || 1 +;

// With a prompt
> 'Input a number: ' [<, 0] $int@ 0 || 1 +;
```

## Copy

Operator: `[+]`  
Copies values on the stack.  
Does not consume any values.  

If used in the form `[+]`, the latest value is copied.  
If used in other forms, those values are copied.  

```
// Prints [1, 1]
< 1 [+] [>];

// Prints [2, 1, 2]
< 2 1 [+, 1] [>];
```

## Delete

Operator: `[-]`  
Deletes values on the stack.  
Consumes values.  

If used in the form `[-]`, the latest value is removed.  
If used in other forms, those values are removed.  
No values are pushed back onto the stack.  

```
// Prints [2]
< 2 1 [-] [>];

// Prints [1]
< 2 1 [-, 1] [>];
```

## Move

Operator: `[&]`  
Moves values on the stack.  
Consumes values.  

If used in the form `[&]`, the latest value is moved (effectively doing nothing).  
If used in other forms, those values are moved to the front.  

```
// Prints [2, 1, 4, 3]
< 1 2 3 4 [&, -2,] [>];
```

## Swap

Operator: `[@]`  
Swaps two values on the stack.  
Consumes values.  

If used in the form `[@]`, the latest value is swapped with the second latest.  
If used in the form `[@, index]`, the latest value is swapped with that index.  
If used in the form `[@, from,]`, the first value is swapped with that index.  
If used in the form `[@, from, to]`, the two values are swapped.  

```
// Prints [2, 3, 1]
< 1 2 3 [@] [>];

// Prints [1, 2, 3]
< 1 2 3 [@, 2] [>];
```

## Reverse

Operator: `[%]`  
Reverses values on the stack.  
Consumes values.  

If used in the form `[%]`, entire stack is reversed.  
If used in other forms, that section is reversed.  

```
// Prints [5, 4, 3, 2, 1]
< 5 4 3 2 1 [%] [>];
```
