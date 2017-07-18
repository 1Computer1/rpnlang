# Data Types

## Stack

The stack is like an array of values.  
It is present in every expression.  

```
// Prints [3, 2, 1]
< 1 2 3 [>];
```

## Stack Transfer

Every expression tries to transfer its stack to the expression that it is contained in.  

```
// Prints [6, 5, 4, 3, 2, 1]
< 1 2 3 { $TRUE: 4 5 6 } [>];
```

Statements, on the other hand, only keep about the latest value in the stack.  
The exception is stack assign statement.  

Lambdas when called without the keep stack operator also only returns the lastest value in the stack.  

## Manipulating

Note that unlike other data types, the stack is not a value that can be operated on.  
The stack must be manipulated with the a stack operator or an iteration in stack mode.  

See: [stack operators](../operators/stack.md), [iteration expression](../expressions/iteration.md).  
