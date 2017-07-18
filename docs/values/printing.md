# Values

## Printing

To print a value, use the `>` statement.  
It will print the latest value of the stack.  

```
// Prints 5
> 1 2 3 4 5;
```

## Silent

The silent print using `<` is not a print at all.  
It can be seen as a no-op.  
It is useful for when printing the entire stack with `[>]` is more relevant.  

```
// Prints [3, 2, 1]
< 1 2 3 [>];
```

## Error

The operator for an error is `!`.  
It will throw an error within the JavaScript process.  

```
// Error: 1:8: Oops
! 'Oops';
```
