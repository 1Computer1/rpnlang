# Expressions

## Branch

The branch expression can be seen as an if-else statement.  
It consumes the latest value on the stack and checks for truthiness.  
The syntax is `{ true, false }`.  

```
// Prints 'true'
> 5 5 + 10 == { 'true', 'false' };

// Prints 'false'
> 5 5 + 11 == { 'true', 'false' };
```

Note that the expressions inside the braces are its own stack.  
The resulting stack of the inner expressions are then added to the original stack.  
