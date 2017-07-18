# Data Types

## Undefined

Undefined represents the lack of a value in the stack.  
When undefined is encountered, RPNLang will try its best to ignore it completely.  
Therefore, it is recommended to use it as sparingly as possible.  

The undefined literal is `[]`.  
The undefined value can be added to the stack with `$UNDEFINED`.  

The difference is that `$UNDEFINED` will last longer than the literal.  
They are, however, the exact same value.  

```
// Both of these prints undefined
> [];
> $UNDEFINED;
```

```
// Prints 1
> 1 { $TRUE: [] };

// Prints undefined
> 1 { $TRUE: $UNDEFINED };
```
