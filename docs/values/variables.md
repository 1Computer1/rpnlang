# Values

## Variables

The latest value of a stack is assigned with the `=` statement.  
Variable identifiers follow the regex `[A-Za-z_][A-Za-z0-9_]*`.  

```
// x is 5
x = 5;

// x is now 2
x = 2;

// y is 1
y = 3 2 1;
```

## Retrieving

Variables can be retrieved with `$` followed by its name.  

```
x = 5;

// Prints 5
> $x;
```

## Stack Assign

You can assign the entire stack to variable with the `#=` statement.  
When stack variables are retrieved, the entire stack is pushed in.  

```
// x is now [3, 2, 1]
x #= 1 2 3;

// Prints [3, 2, 1]
< $x [>];
```

To retrieve parts of a stack variable, a slice operator is used.  

See: [slice operators](../operators/slice.md).  
