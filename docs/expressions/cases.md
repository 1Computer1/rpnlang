# Expressions

## Cases

The cases expression can be seen as an if-else if statement.  
Unlike the branch expression, it does not check the latest value on the stack.  
The syntax is `{ condition: expression, condition: expression, ... }`.  

```
// Prints '1 is 1'
> {
    1 2 == : '1 is 2',
    1 1 == : '1 is 1'
};
```

## Default Case

The default case can be made by having a condition that always evaluate to true.  
For example, `!!`, `$TRUE`, `1`, etc.  

```
f = (n) => ({
    $n 2 % 0 == : 'even',
    !! : 'odd'
});

// Prints odd
> 9 $f@;
```
